import User from "../models/user.js";
import { env } from "../../config/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js";
import { getSession } from "../../loaders/neo4j.js";
import { IsEmptyOrUndefined } from "../../helpers/emptyBodyCheck.js";

export async function login(req, res, next) {
  if(IsEmptyOrUndefined(req.body)){
    return next({
      httpCode: 400,
      messageCode: "isMissingCode400",
      objectName: "Request body"
    });
  }
  if(req.body.email === undefined || req.body.password === undefined){
    return next({
      httpCode: 400,
      messageCode: "isMissingCode400",
      objectName: "email or password"
    });
  }
  logger.debug("get user");
  let returnItem;
  try {
    returnItem = await User.findOne({
      email: req.body.email,
    });
  } catch (error) {
    return next({
      httpCode: 404,
      messageCode: "code404",
      error: error,
      objectName: "user",
    });
  }
  if (returnItem != null) {
    bcrypt
      .compare(req.body.password, returnItem.password)
      .then((match) => {
        if (match) {
          returnItem = returnItem.toJSON();
          returnItem.token = signToken(returnItem.id);
          delete returnItem.password;
          delete returnItem._id;
          delete returnItem.__v;
          delete returnItem.content;
          delete returnItem.contentLists;
          return next({
            httpCode: 200,
            messageCode: "tokenSuccess",
            result: returnItem,
          });
        } else {
          logger.debug("Wrong username of password");
          return next({
            httpCode: 400,
            messageCode: "notAuthenticated",
          });
        }
      })
      .catch((error) => {
        return next({
          httpCode: 500,
          messageCode: "code500",
          error: error,
        });
      });
  } else {
    return next({
      httpCode: 404,
      messageCode: "code404",
      objectName: "user",
    });
  }
}

export async function register(req, res, next) {
  if(IsEmptyOrUndefined(req.body)){
    return next({
      httpCode: 400,
      messageCode: "isMissingCode400",
      objectName: "Request body"
    });
  }
  let returnItem;
  if(req.body.password !== undefined){
    bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        logger.error("hashing error", error);
        return next({
          httpCode: 500,
          messageCode: "code500",
          result: token,
        });
      } else if (hash) {
        logger.debug("Password has been hashed");
        try {
          //Create new user
          returnItem = await User.create({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          });
        } catch (error) {
          return next({
            httpCode: 400,
            messageCode: "alreadyExists",
            objectName: "User",
            error: error,
          });
        }
        try {
          //If user is created in Mongo, add userid as node in Neo4j
          let session = getSession()
          let neoQuery = await session.run('MERGE (:User{_id: $id })',
          {id: returnItem.id})
        } catch (error) {
          //If there is a Neo4j error, the user is deleted in Mongodb.
          try {
            //Use findByIdAndDelete over findByIdAndRemove: https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
            returnItem = await User.findByIdAndDelete(returnItem.id);
          } catch (error2) {
            //If that goes wrong... Well, I've tried
            error = error + "\n reverting user has failed, please contact the administrator:" + error2
          }
          return next({
            httpCode: 500,
            messageCode: "code500",
            error: error,
          });
        }
        returnItem = returnItem.toJSON();
        returnItem.token = signToken(returnItem.id);
        delete returnItem.password;
        delete returnItem._id;
        delete returnItem.__v;
        delete returnItem.content;
        delete returnItem.contentLists;
        return next({
          httpCode: 201,
          messageCode: "tokenSuccess",
          result: returnItem,
        });
      }
    });
  } else {
    return next({
      httpCode: 400,
      messageCode: "passwordNotIncluded"
    });
  }
  
}
export async function authoriseToken(req, res, next) {
  logger.info(`[AuthenticationController] validateToken`);
  // The headers should contain the authorization-field with value 'Bearer [token]'
  const authHeader = req.headers.authorization;
  logger.debug("Header: ", req.headers.authorization);
  if (!authHeader) {
    logger.warn("Authorization header missing!");
    return next({
      httpCode: 401,
      messageCode: "tokenMissing",
    });
  } else {
    // Strip the word 'Bearer ' from the headervalue
    const token = authHeader.substring(7, authHeader.length);

    jwt.verify(token, env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        logger.warn("Not authorised", err);
        next({
          messageCode: "tokenNotAuthorised",
          status: 401,
        });
      }
      if (payload) {
        logger.debug("Token is valid", payload);
        // User heeft toegang. Voeg UserId uit payload toe aan
        // request, voor ieder volgend endpoint.
        req.userId = payload.id;
        next();
      }
    });
  }
}
function signToken(id) {
  return jwt.sign({ id }, env.JWT_SECRET_KEY, {
    expiresIn: "5h",
  });
}
