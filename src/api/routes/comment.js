import { Router } from "express";
import {
  addComment,
  getComment,
  removeComment,
  updateComment,
} from "../controllers/commentController.js";
import { authoriseToken } from "../controllers/authController.js";
const router = Router();

router.get("/", authoriseToken, getComment);
router.post("/", authoriseToken, addComment);
router.delete("/", authoriseToken, removeComment);
router.put("/", authoriseToken, updateComment);
export default router;
