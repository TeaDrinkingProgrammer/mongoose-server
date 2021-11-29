import { Router } from "express";
import content from "./content.js";
const router = Router();
router.use("/content", content);

export default router;
