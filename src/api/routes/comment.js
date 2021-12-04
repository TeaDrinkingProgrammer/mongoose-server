import { Router } from "express";
import {
  addComment,
  getComment,
  removeComment,
  updateComment,
} from "../controllers/commentController.js";
const router = Router();

router.get("/", getComment);
router.post("/", addComment);
router.delete("/", removeComment);
router.put("/", updateComment);
export default router;
