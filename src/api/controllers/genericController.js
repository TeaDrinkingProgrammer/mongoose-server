import logger from "../../config/logger.js";

export async function get(model, objectName, req, res, next) {
  logger.debug("generic get");
  let returnItem;
  if (req.query.id) {
    try {
      returnItem = await model.findById(req.query.id);
    } catch (error) {
      return next({
        httpCode: 500,
        messageCode: "retrievalError",
        objectName: objectName,
        error: error,
      });
    }

    if (returnItem === null) {
      return next({
        httpCode: 404,
        messageCode: "code404",
        objectName: objectName,
      });
    } else {
      return next({
        httpCode: 200,
        result: returnItem,
      });
    }
  }
  return next({
    httpCode: 400,
    messageCode: "idNotIncludedError",
  });
}

export async function add(model, objectName, req, res, next) {
  logger.debug("generic add");
  let returnItem;
  try {
    returnItem = await model.create(req.body);
  } catch (error) {
    return next({
      httpCode: 500,
      messageCode: "creationError",
      error: error,
      objectName: objectName,
    });
  }
  return next({
    httpCode: 200,
    messageCode: "creationSuccess",
    objectName: objectName,
    result: returnItem,
  });
}
export async function update(model, objectName, req, res, next) {
  logger.debug("addContent");
  let returnItem;
  if (req.query.id || req.body) {
    try {
      if (await model.findByIdAndUpdate(req.query.id, req.body)) {
        returnItem = await model.findById(req.query.id);
      }
    } catch (error) {
      return next({
        httpCode: 500,
        messageCode: "updateError",
        error: error,
        objectName: objectName,
      });
    }
    if (returnItem !== null) {
      return next({
        httpCode: 200,
        messageCode: "updateSuccess",
        objectName: objectName,
        result: returnItem,
      });
    } else {
      return next({
        httpCode: 200,
        messageCode: "updateError",
        objectName: objectName,
        error: returnItem,
      });
    }
  }
  return next({
    httpCode: 400,
    messageCode: "idAndBodyNotIncludedError",
  });
}

export async function remove(model, objectName, req, res, next) {
  logger.debug("generic remove");
  let returnItem;
  if (req.query.id) {
    try {
      //Use findByIdAndDelete over findByIdAndRemove: https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
      returnItem = await model.findByIdAndDelete(req.query.id);
    } catch (error) {
      return next({
        httpCode: 500,
        messageCode: "deletionError",
        objectName: objectName,
        error: error,
      });
    }
    return next({
      httpCode: 200,
      messageCode: "deletionSuccess",
      objectName: objectName,
      result: returnItem,
    });
  }
  return next({
    httpCode: 400,
    messageCode: "idNotIncludedError",
  });
}
