// src/controllers/lines.controller.js
import { openDB } from "../db/db.js";

// GET: Obtener todas las líneas
export async function getAllLines(req, res) {
    try {
        const db = await openDB();
        const lines = await db.all("SELECT * FROM lines");
        res.status(200).json(lines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las líneas" });
    }
}

// GET: Obtener una línea por ID
export async function getLineById(req, res) {
    try {
        const id = req.params.id;
        const db = await openDB();
        const line = await db.get("SELECT * FROM lines WHERE id = ?", [id]);

        if (!line) {
            return res.status(404).json({ error: "Línea no encontrada" });
        }

        res.status(200).json(line);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener la línea" });
    }
}

// GET: Obtener todas las incidencias (para la tabla)
export async function getAllIncidents(req, res) {
    try {
        const db = await openDB();
        // Traemos los datos que coinciden con tus columnas: id, linea, reportado_por, tipo, prioridad, estado
        const incidents = await db.all("SELECT * FROM incidents");
        res.status(200).json(incidents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las incidencias" }); // [cite: 18, 59]
    }
}

// PUT: Actualizar el estado (lo que hace el botón "Guardar")
export async function updateIncidentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await openDB();
        
        await db.run("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado" });
    }
}