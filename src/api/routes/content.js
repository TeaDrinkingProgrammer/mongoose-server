import { Router } from "express";
import {
  addContent,
  getContent,
  removeContent,
} from "./../controllers/content/contentController.js";
const router = Router();

router.get("/", getContent);
router.post("/", addContent);
router.delete("/", removeContent);
export default router;
