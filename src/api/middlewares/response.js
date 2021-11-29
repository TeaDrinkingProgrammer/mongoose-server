import logger from "../../config/logger";
import en from "../../lang/get-text";
export default (httpCode, messageCode) => {
  logger.debug("Response middleware:");
  logger.debug("Status: ", httpCode);
  logger.debug("Message: ", en[messageCode]);
};
