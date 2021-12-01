import { Router } from "express";
import {
  addContent,
  getContent,
} from "./../controllers/content/contentController.js";
const router = Router();

router.get("/", getContent);
router.post("/", addContent);
export default router;
