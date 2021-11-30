import { Router } from "express";
import getContent from "./../controllers/content/contentController.js";
const router = Router();

router.get("/:id", getContent);
// router.get("/", (req, res) => {
//   res.status(200).json({ message: "content request" });
// });
router.get("/", getContent);
export default router;
