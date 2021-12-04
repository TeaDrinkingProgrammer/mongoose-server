import Comment from "../models/comment.js";
import { getById, add, update, remove } from "./genericController.js";

export async function getComment(req, res, next) {
  await getById(Comment, "comment", req, res, next);
}
export async function addComment(req, res, next) {
  await add(Comment, "comment", req, res, next);
}
export async function updateComment(req, res, next) {
  await update(Comment, "comment", req, res, next);
}
export async function removeComment(req, res, next) {
  await remove(Comment, "comment", req, res, next);
}
