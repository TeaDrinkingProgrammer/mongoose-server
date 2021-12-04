import { Router } from "express";
import {
  addUser,
  getUser,
  removeUser,
  updateUser,
} from "../controllers/userController.js";
const router = Router();

router.get("/", getUser);
router.post("/", addUser);
router.delete("/", removeUser);
router.put("/", updateUser);
export default router;
