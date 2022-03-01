import express from "express";
import routes from "./../api/routes/index.js";
import { prefix } from "./../config/index.js";
import getText from "../lang/get-text.js";
import response from "../api/middlewares/response.js";
import logger from "../config/logger.js";
import bodyParser from "body-parser";
import cors from "cors";
export default (app) => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.disable("x-powered-by");
  app.disable("etag");
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
