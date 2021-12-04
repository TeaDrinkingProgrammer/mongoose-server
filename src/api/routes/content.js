import { Router } from "express";
import {
  addContent,
  getContent,
  removeContent,
  updateContent,
} from "./../controllers/contentController.js";
const router = Router();

router.get("/", getContent);
router.post("/", addContent);
router.delete("/", removeContent);
router.put("/", updateContent);
export default router;
