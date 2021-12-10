import Comment from "../models/comment.js";
import User from "../models/user.js";
import { get, getById, add, update, removeById } from "./genericController.js";

export async function getComment(req, res, next) {
  if (req.query.id) {
    await getById(Comment, "comment", req.query.id, next);
  } else {
    if (req.query.contentId) {
      req.body.content = req.query.contentId;
    }
    let sortOn = req.query.sortOn ? req.query.sortOn : "karma";
    await get(
      Comment,
      "comment",
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
export async function addComment(req, res, next) {
  //TODO add id here and in other controllers
  req.body.user = req.userId;
  await add(Comment, "comment", req.body, next);
}
export async function updateComment(req, res, next) {
  // req.body.user = req.userId;
  await update(Comment, "comment", req.query.id, req.body, next);
}
export async function removeComment(req, res, next) {
  // req.body.user = req.userId;
  await removeById(Comment, "comment", req.query.id, next);
}

// export async function upvote(req, req, next) {
//   await update(Comment, "comment", req.query.id, body, next);
// }
