import { Router } from "express";
import { getLineDetail } from "../controllers/details.controller.js";

const router = Router();

router.get("/:id", getLineDetail);

export default router;