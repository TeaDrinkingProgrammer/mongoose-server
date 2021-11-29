import logger from "../config/logger.js";

class Lang {
  genericStrings = {
    welcomeCode: "Client connected",
    serverStart: "Server started",
    testConnection: "Successfully connected to server",
  };
  objectName = " ";
  interpolatedStrings = {
    code404: `${this.objectName} does not exist`,
  };

  getString(messageCode, objectName) {
    logger.debug("getText: ", messageCode, objectName);
    if (
      objectName !== undefined &&
      this.interpolatedStrings[messageCode] !== null
    ) {
      this.objectName = objectName;
      return this.interpolatedStrings[messageCode];
    } else if (this.genericStrings[messageCode] !== null) {
      return this.genericStrings[messageCode];
    } else {
      logger.error("String does not exist! Messagecode: ", messageCode);
    }
  }
}
export default new Lang();
