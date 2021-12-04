import User from "../models/user.js";
import { getById, add, update, remove } from "./genericController.js";

export async function getUser(req, res, next) {
  await getById(User, "user", req, res, next);
}
export async function addUser(req, res, next) {
  await add(User, "user", req, res, next);
}
export async function updateUser(req, res, next) {
  await update(User, "user", req, res, next);
}
export async function removeUser(req, res, next) {
  await remove(User, "user", req, res, next);
}
