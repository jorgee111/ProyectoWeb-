import { Router } from "express";
import { 
    createIncident, 
    getUserIncidents, 
    getAllIncidents, 
    updateIncidentStatus 
} from "../controllers/incidents.controller.js";

const router = Router();


router.post("/", createIncident);


router.get("/", getAllIncidents); 


router.get("/user/:username", getUserIncidents);

router.put("/:id", updateIncidentStatus);

export default router;