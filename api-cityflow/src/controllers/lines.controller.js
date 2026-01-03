import { openDB } from "../db/db.js";

// GET: Todas las líneas (para el dashboard normal)
export async function getAllLines(req, res) {
    try {
        const db = await openDB();
        const lines = await db.all("SELECT * FROM lines");
        res.status(200).json(lines);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener líneas" });
    }
}

// GET: Todas las incidencias (Para el admin)
export async function getAllIncidents(req, res) {
    try {
        const db = await openDB();
        const incidents = await db.all("SELECT * FROM incidents");
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener incidencias" });
    }
}

// PUT: Actualizar estado (Para el botón Guardar del admin)
export async function updateIncidentStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const db = await openDB();
        await db.run("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
        res.status(200).json({ message: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
}