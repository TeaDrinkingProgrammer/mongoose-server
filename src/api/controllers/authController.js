import User from "../models/user.js";
import { jwtSecretKey } from "../../config/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js";

export async function login(req, res, next) {
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
}

export async function register(req, res, next) {
  let returnItem;
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
        returnItem = await User.create({
          email: req.body.email,
          password: hash,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });
      } catch (error) {
        logger.error("User does not exist");
        return next({
          httpCode: 500,
          messageCode: "code404",
          objectName: "user",
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
        httpCode: 200,
        messageCode: "tokenSuccess",
        result: returnItem,
      });
    }
    logger.error("This shouldn't happen");
  });
}
export async function authoriseToken(req, res, next) {
  logger.info(`[AuthenticationController] validateToken`);
  // The headers should contain the authorization-field with value 'Bearer [token]'
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn("Authorization header missing!");
    return next({
      httpCode: 401,
      messageCode: "tokenMissing",
    });
  } else {
    // Strip the word 'Bearer ' from the headervalue
    const token = authHeader.substring(7, authHeader.length);

    jwt.verify(token, jwtSecretKey, (err, payload) => {
      if (err) {
        logger.warn("Not authorised", err);
        next({
          message: "tokenNotAuthorised",
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
  return jwt.sign({ id }, jwtSecretKey, {
    expiresIn: "5h",
  });
}
