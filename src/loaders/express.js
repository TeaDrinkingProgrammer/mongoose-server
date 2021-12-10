import express from "express";
import routes from "./../api/routes/index.js";
import { prefix } from "./../config/index.js";
import { jwtSecretKey } from "../config/index.js";
import getText from "../lang/get-text.js";
import response from "../api/middlewares/response.js";
import logger from "../config/logger.js";
import bodyParser from "body-parser";
import cors from "cors";
export default (app) => {
  // process.on("uncaughtException", async (error) => {
  //   // console.log(error);
  //   logger("00001", "", error.message, "Uncaught Exception", "");
  // });

  // process.on("unhandledRejection", async (ex) => {
  //   // console.log(ex);
  //   logger("00002", "", ex.message, "Unhandled Rejection", "");
  // });

  // if (!jwtSecretKey) {
  //   logger("00003", "", "Jwtprivatekey is not defined", "Process-Env", "");
  //   process.exit(1);
  // }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.disable("etag");
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });
  app.use(cors());
  app.use(prefix, routes);

  app.get("/", (_req, res) => {
    return res
      .status(200)
      .json({
        resultMessage: getText("testConnection"),
      })
      .end();
  });

  // app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  //   );
  //   res.header("Content-Security-Policy-Report-Only", "default-src: https:");
  //   if (req.method === "OPTIONS") {
  //     res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
  //     return res.status(200).json({});
  //   }
  //   next();
  // });

  app.use(response);
  app.use((req, res, next) => {
    response(
      { httpCode: 404, messageCode: "endpointNotFoundError" },
      req,
      res,
      next
    );
  });
};
