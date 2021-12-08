import Content from "../models/content.js";
import { get, getById, add, update, removeById } from "./genericController.js";

export async function getContent(req, res, next) {
  if (req.query.id) {
    await getById(Content, "content", req.query.id, next);
  } else {
    let sortOn = req.query.sortOn ? req.query.sortOn : "name";
    await get(
      Content,
      "content",
      sortOn,
      req.query.sortOrder,
      req.query.skip,
      req.query.limit,
      req.body,
      next
    );
    //model, objectName, sortOn, skip, limit, body, next
  }
}
export async function addContent(req, res, next) {
  req.body.user = req.userId;
  await add(Content, "content", req.body, next);
}
export async function updateContent(req, res, next) {
  req.body.user = req.userId;
  await update(Content, "content", req.query.id, req.body, next);
}
export async function removeContent(req, res, next) {
  req.body.user = req.userId;
  await removeById(Content, "content", req.query.id, next);
}
// export async function getContent(req, res, next) {
//   logger.debug("getContent");
//   let content;
//   if (req.query.id) {
//     try {
//       content = await Content.findById(req.query.id);
//     } catch (error) {
//       return next({
//         httpCode: 500,
//         messageCode: "retrievalError",
//         objectName: "content",
//         error: error,
//       });
//     }

//     if (content === null) {
//       return next({
//         httpCode: 404,
//         messageCode: "code404",
//         objectName: "content",
//       });
//     } else {
//       return next({
//         httpCode: 200,
//         result: content,
//       });
//     }
//   }
//   return next({
//     httpCode: 400,
//     messageCode: "idNotIncludedError",
//   });
// }

// export async function addContent(req, res, next) {
//   logger.debug("addContent");
//   let content;
//   try {
//     content = await Content.create(req.body);
//   } catch (error) {
//     return next({
//       httpCode: 500,
//       messageCode: "creationError",
//       error: error,
//       objectName: "content",
//     });
//   }
//   return next({
//     httpCode: 200,
//     messageCode: "creationSuccess",
//     objectName: "content",
//     result: content,
//   });
// }
// export async function updateContent(req, res, next) {
//   logger.debug("addContent");
//   let content;
//   if (req.query.id || req.body) {
//     try {
//       if (await Content.findByIdAndUpdate(req.query.id, req.body)) {
//         content = await Content.findById(req.query.id);
//       }
//     } catch (error) {
//       return next({
//         httpCode: 500,
//         messageCode: "updateError",
//         error: error,
//         objectName: "content",
//       });
//     }
//     if (content !== null) {
//       return next({
//         httpCode: 200,
//         messageCode: "updateSuccess",
//         objectName: "content",
//         result: content,
//       });
//     } else {
//       return next({
//         httpCode: 200,
//         messageCode: "updateError",
//         objectName: "content",
//         error: content,
//       });
//     }
//   }
//   return next({
//     httpCode: 400,
//     messageCode: "idAndBodyNotIncludedError",
//   });
// }

// export async function removeContent(req, res, next) {
//   logger.debug("removeContent");
//   let content;
//   if (req.query.id) {
//     try {
//       //Use findByIdAndDelete over findByIdAndRemove: https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
//       content = await Content.findByIdAndDelete(req.query.id);
//     } catch (error) {
//       return next({
//         httpCode: 500,
//         messageCode: "deletionError",
//         objectName: "content",
//         error: error,
//       });
//     }
//     return next({
//       httpCode: 200,
//       messageCode: "deletionSuccess",
//       objectName: "content",
//       result: content,
//     });
//   }
//   return next({
//     httpCode: 400,
//     messageCode: "idNotIncludedError",
//   });
// }
