
import { Router } from "express";

import { getAllLines, getLineById } from "../controllers/lines.controller.js";

const router = Router();

router.get("/", getAllLines);
router.get("/:id", getLineById);

export default router;