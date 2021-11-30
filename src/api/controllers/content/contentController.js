import logger from "../../../config/logger.js";
import Content from "../../models/contentModel.js";

export default async function getContent(req, res, next) {
  logger.debug("getContent");
  let content;
  if (req.query.id) {
    try {
      content = await Content.findById(req.query.id);
    } catch (error) {
      logger.error("Error getting content: ", error);
      return next({
        httpCode: 500,
        messageCode: "retrievalError",
        objectName: "content",
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
