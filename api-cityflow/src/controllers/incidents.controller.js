import { openDB } from "../db/db.js";

// 1. CREAR (Usuario)
export async function createIncident(req, res) {
    try {
        const { line_name, type, description, assistance, user_name } = req.body;

        if (!line_name || !type || !description || !user_name) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
        }

        const status = "pending";          
        const date = new Date().toISOString().split('T')[0]; 
        const priority = assistance ? "Alta" : "Normal";

        const db = await openDB();
        await db.run(
            "INSERT INTO incidents (line_name, user_name, type, description, priority, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [line_name, user_name, type, description, priority, status, date]
        );

        res.status(201).json({ success: true, message: "Incidencia creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al guardar" });
    }
}

// 2. VER HISTORIAL PROPIO (Usuario)
export async function getUserIncidents(req, res) {
    try {
        const { username } = req.params;
        const db = await openDB();
        const incidents = await db.all("SELECT * FROM incidents WHERE user_name = ? ORDER BY date DESC", [username]);
        
        // Formateo simple
        const formatted = incidents.map(inc => ({ ...inc, line: inc.line_name })); 
        
        res.status(200).json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al recuperar historial" });
    }
}

// 3. VER TODAS (Admin) - MOVIDO AQUÍ
export async function getAllIncidents(req, res) {
    try {
        const db = await openDB();
        // Traemos todas ordenadas por fecha
        const incidents = await db.all("SELECT * FROM incidents ORDER BY date DESC");
        res.status(200).json(incidents);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener incidencias" });
    }
}

// 4. ACTUALIZAR ESTADO (Admin) - MOVIDO AQUÍ
export async function updateIncidentStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await openDB();
        await db.run("UPDATE incidents SET status = ? WHERE id = ?", [status, id]);
        res.status(200).json({ success: true, message: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
}