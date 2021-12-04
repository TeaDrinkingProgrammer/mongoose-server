import Content from "../models/content.js";
import { get, add, update, remove } from "./genericController.js";

export async function getContent(req, res, next) {
  await get(Content, "content", req, res, next);
}
export async function addContent(req, res, next) {
  await add(Content, "content", req, res, next);
}
export async function updateContent(req, res, next) {
  await update(Content, "content", req, res, next);
}
export async function removeContent(req, res, next) {
  await remove(Content, "content", req, res, next);
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
