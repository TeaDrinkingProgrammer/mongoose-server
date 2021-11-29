import logger from "../../config/logger.js";
import getText from "../../lang/get-text.js";
export default (packet, req, res, next) => {
  logger.debug("Response middleware:");
  logger.debug("Status: ", packet.httpCode);
  logger.debug("Message: ", getText(packet.messageCode));
  if (packet.httpCode > 200 && packet.httpCode < 300) {
    res.status(packet.httpCode).json(packet.results);
  } else if (packet.httpCode > 300 && packet.httpCode < 600) {
    res.status(packet.httpCode).json({ error: getText(messageCode) });
  }
};
