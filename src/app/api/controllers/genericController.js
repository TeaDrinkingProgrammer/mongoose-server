import logger from "../../config/logger.js";

export async function get(
  model,
  objectName,
  sortOn,
  sortOrder,
  skip,
  limit,
  body,
  next
) {
  logger.debug("generic get");
  let returnItem, query;
  try {
    //Building the query
    if (body) {
      query = model.find(body);
    } else {
      query = model.find({});
    }
    //Can sort on nonexistent field
    if (!sortOn) {
      logger.error("Cannot call get without sortOn argument!");
      return next({
        httpCode: 500,
        messageCode: "sortOnNotIncluded",
      });
    } else if (sortOrder == ("asc" || "desc")) {
      let queryObject = {};
      queryObject[sortOn] = sortOrder;
      logger.debug(queryObject);
      query.sort(queryObject);
    } else {
      let queryObject = {};
      queryObject[sortOn] = 1;
      logger.debug(queryObject);
      query.sort(queryObject);
    }
    if (skip) {
      logger.debug("limit added");
      query.skip(skip);
    }
    if (limit) {
      logger.debug("limit added");
      query.limit(limit);
    }
    returnItem = await query;
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
export async function getById(model, objectName, id, next) {
  logger.debug("generic get");
  let returnItem;
  if (id) {
    try {
      returnItem = await model.findById(id);
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

export async function add(model, objectName, body, next) {
  logger.debug("generic add");
  let returnItem;
  try {
    returnItem = await model.create(body);
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
export async function update(model, objectName, id, body, next) {
  logger.debug("addContent");
  logger.debug("update body:", body);
  let returnItem;
  if (id && body) {
    try {
      if (await model.findByIdAndUpdate(id, body)) {
        returnItem = await model.findById(id);
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

export async function removeById(model, objectName, id, next) {
  logger.debug("generic remove");
  let returnItem;
  if (id) {
    try {
      //Use findByIdAndDelete over findByIdAndRemove: https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
      returnItem = await model.findByIdAndDelete(id);
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