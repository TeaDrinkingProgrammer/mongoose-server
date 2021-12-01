import logger from "../../config/logger.js";
import getText from "../../lang/get-text.js";
export default (packet, req, res, next) => {
  logger.debug("Response middleware:");
  logger.debug("Status: ", packet.httpCode);
  logger.debug("Result: ", packet.result);
  let message = getText(packet.messageCode, packet.objectName);
  logger.debug("Message: ", message);
  if (
    (packet.httpCode >= 200 && packet.httpCode < 300) ||
    packet.httpCode === undefined
  ) {
    logger.debug("response: ", {
      message: message,
      result: packet.result,
    });
    res.status(packet.httpCode).json({
      message: message,
      result: packet.result,
    });
  } else if (packet.httpCode >= 300 && packet.httpCode < 600) {
    if (packet.error) {
      logger.debug("Error: ", packet.error);
      res.status(packet.httpCode).json({
        message: message,
      });
    } else {
      res.status(packet.httpCode).json({ message: message });
    }
  }
};
