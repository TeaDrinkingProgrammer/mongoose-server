import logger from "../../../config/logger.js";
import Content from "../../models/contentModel.js";

export async function getContent(req, res, next) {
  logger.debug("getContent");
  let content;
  if (req.query.id) {
    try {
      content = await Content.findById(req.query.id);
    } catch (error) {
      return next({
        httpCode: 500,
        messageCode: "retrievalError",
        objectName: "content",
        error: error,
      });
    }

    return next({
      httpCode: 200,
      result: content,
    });
  }
  return next({
    httpCode: 400,
    messageCode: "idNotIncludedError",
  });
}

export async function addContent(req, res, next) {
  logger.debug("addContent");
  let content;
  try {
    content = await Content.create(req.body);
  } catch (error) {
    return next({
      httpCode: 500,
      messageCode: "creationError",
      error: error,
      objectName: "content",
    });
  }
  return next({
    httpCode: 200,
    messageCode: "creationSuccess",
    objectName: "content",
    result: content,
  });
}
