import { Router } from "express";
import {
  addContentList,
  getContentList,
  removeContentList,
  updateContentList,
} from "../controllers/contentListController.js";
const router = Router();

router.get("/", getContentList);
router.post("/", addContentList);
router.delete("/", removeContentList);
router.put("/", updateContentList);
export default router;
