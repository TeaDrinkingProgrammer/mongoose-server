import logger from "../config/logger.js";

class Lang {
  genericStrings = {
    welcomeCode: "Client connected",
    serverStart: "Server started",
    testConnection: "Successfully connected to server",
    endpointNotFoundError: "Endpoint not found!",
    idNotIncludedError:
      "Invalid request: cannot do a get request without an Id!",
  };
  objectName = " ";
  interpolatedStrings = {
    code404: `${this.objectName} does not exist`,
    retrievalError: `${this.objectName} could not be retrieved`,
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
