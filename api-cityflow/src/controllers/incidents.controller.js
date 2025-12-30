import { openDB } from "../db/db.js";


export async function createIncident(req, res) {
    let db;
    try {
        
        const { line_name, type, description, assistance } = req.body;

        
        if (!line_name || !type || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos obligatorios (Línea, Tipo o Descripción)" 
            });
        }

        
        const user_name = "Conductor_Demo"; 
        const status = "pending";          
        
        
        const date = new Date().toISOString().split('T')[0]; 

        
        const priority = assistance ? "Alta" : "Normal";

        
        db = await openDB();
        
        const sql = `
            INSERT INTO incidents (line_name, user_name, type, description, priority, status, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.run(sql, [line_name, user_name, type, description, priority, status, date]);

        
        res.status(201).json({
            success: true,
            message: "Incidencia creada correctamente"
        });

    } catch (error) {
        console.error("Error creating incident:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al guardar la incidencia" 
        });
    }
}

export async function getUserIncidents(req, res) {
    let db;
    try {
        const { username } = req.params; // Recibimos el nombre por la URL

        db = await openDB();
        
        // Buscamos todas las incidencias de ese usuario ordenadas por fecha (más nuevas primero)
        const sql = "SELECT * FROM incidents WHERE user_name = ? ORDER BY date DESC";
        const incidents = await db.all(sql, [username]);

        // Formateamos para el frontend
        const formattedIncidents = incidents.map(inc => ({
            id: inc.id,
            date: inc.date,       // Ej: 2024-10-26
            line: inc.line_name,  // Ej: Línea 5 - Azul
            type: inc.type,       // Ej: Avería Motor
            priority: inc.priority,
            status: inc.status,   // 'pending' o 'solved'
            description: inc.description
        }));

        res.status(200).json({
            success: true,
            data: formattedIncidents
        });

    } catch (error) {
        console.error("Error getting user incidents:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al recuperar el historial" 
        });
    }
}