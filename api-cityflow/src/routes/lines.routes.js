// src/routes/lines.routes.js
import { Router } from "express";
import { 
    getAllLines, 
    getLineById, 
    getAllIncidents,     // <--- AÑADIR ESTO
    updateIncidentStatus // <--- AÑADIR ESTO
} from "../controllers/lines.controller.js";

const router = Router();

// Rutas para Incidencias (Administración)
// Estas deben ir arriba para que no se confundan con un ID
router.get("/incidents", getAllIncidents);           // GET /api/lines/incidents
router.put("/incidents/:id", updateIncidentStatus); // PUT /api/lines/incidents/:id

// Rutas para Líneas (Dashboard de usuario)
router.get("/", getAllLines);
router.get("/:id", getLineById);

export default router;