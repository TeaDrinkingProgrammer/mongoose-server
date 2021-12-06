import User from "../models/user.js";
import { get, getById, add, update, removeById } from "./genericController.js";

export async function getUser(req, res, next) {
  if (req.query.id) {
    await getById(User, "user", req.query.id, next);
  } else {
    let sortOn = req.query.sortOn ? req.query.sortOn : "username";
    await get(
      User,
      "user",
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
export async function addUser(req, res, next) {
  await add(User, "user", req.body, next);
}
export async function updateUser(req, res, next) {
  await update(User, "user", req.query.id, req.body, next);
}
export async function removeUser(req, res, next) {
  await removeById(User, "user", req.query.id, next);
}
