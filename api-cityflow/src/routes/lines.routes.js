import { Router } from "express";
import { 
    getAllLines, 
    getAllIncidents, 
    updateIncidentStatus 
} from "../controllers/lines.controller.js";

const router = Router();

router.get("/", getAllLines);
router.get("/incidents", getAllIncidents); // Esta es la que usa admin.js
router.put("/incidents/:id", updateIncidentStatus); // Esta es la del botón Guardar

export default router;