import ContentList from "../models/contentList.js";
import { get, getById, add, update, removeById } from "./genericController.js";

export async function getContentList(req, res, next) {
  if (req.query.id) {
    await getById(ContentList, "contentList", req.query.id, next);
  } else {
    let sortOn = req.query.sortOn ? req.query.sortOn : "name";
    await get(
      ContentList,
      "contentList",
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
export async function addContentList(req, res, next) {
  await add(ContentList, "contentList", req.body, next);
}
export async function updateContentList(req, res, next) {
  await update(ContentList, "contentList", req.query.id, req.body, next);
}
export async function removeContentList(req, res, next) {
  await removeById(ContentList, "contentList", req.query.id, next);
}
