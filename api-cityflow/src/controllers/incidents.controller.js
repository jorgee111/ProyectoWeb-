import { openDB } from "../db/db.js";

export async function createIncident(req, res) {
    let db;
    try {
        // 1. CAMBIO PRINCIPAL: Añadimos 'user_name' a la extracción de datos
        const { line_name, type, description, assistance, user_name } = req.body;

        // 2. VALIDACIÓN: Comprobamos que el usuario no venga vacío
        if (!line_name || !type || !description || !user_name) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos obligatorios (Usuario, Línea, Tipo o Descripción)" 
            });
        }

        // --- LÍNEA ELIMINADA: const user_name = "Conductor_Demo"; ---
        // Ahora usamos la variable 'user_name' que viene del req.body
        
        const status = "pending";          
        const date = new Date().toISOString().split('T')[0]; 
        const priority = assistance ? "Alta" : "Normal";

        db = await openDB();
        
        const sql = `
            INSERT INTO incidents (line_name, user_name, type, description, priority, status, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // El user_name aquí ya es el dinámico (ej: "barbe", "pol", etc.)
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

// La función getUserIncidents la tenías bien, la dejo aquí por si necesitas el archivo completo
export async function getUserIncidents(req, res) {
    let db;
    try {
        const { username } = req.params;

        db = await openDB();
        
        const sql = "SELECT * FROM incidents WHERE user_name = ? ORDER BY date DESC";
        const incidents = await db.all(sql, [username]);

        const formattedIncidents = incidents.map(inc => ({
            id: inc.id,
            date: inc.date,
            line: inc.line_name,
            type: inc.type,
            priority: inc.priority,
            status: inc.status,
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