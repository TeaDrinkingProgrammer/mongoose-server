import ContentList from "../models/contentList.js";
import { getById, add, update, remove } from "./genericController.js";

export async function getContentList(req, res, next) {
  await getById(ContentList, "contentList", req, res, next);
}
export async function addContentList(req, res, next) {
  await add(ContentList, "contentList", req, res, next);
}
export async function updateContentList(req, res, next) {
  await update(ContentList, "contentList", req, res, next);
}
export async function removeContentList(req, res, next) {
  await remove(ContentList, "contentList", req, res, next);
}
