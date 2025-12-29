import { Router } from "express";
import { createIncident, getUserIncidents } from "../controllers/incidents.controller.js";

const router = Router();

router.post("/", createIncident);
router.get("/user/:username", getUserIncidents);

export default router;