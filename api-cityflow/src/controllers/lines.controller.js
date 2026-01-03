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

export async function getLineDetail(req, res) {
   
  
    
    try {
        const { id } = req.params;
        const db = await openDB();
        const line = await db.get("SELECT * FROM lines WHERE id = ?", [id]);

        if (!line) {
            return res.status(404).json({ 
                success: false, 
                message: "Línea no encontrada" 
            });
        }


        const fleet = await db.all("SELECT * FROM vehicles WHERE line_id = ?", [id]);


        let displayStatus = "Desconocido";
        if (line.status === 'ok') displayStatus = "Operativa";
        else if (line.status === 'warn') displayStatus = "Retraso";
        else if (line.status === 'alert') displayStatus = "Incidencia";


        res.status(200).json({
            success: true,
            data: {
                id: line.id,
                name: line.name,
                zone: line.zone,
                status: displayStatus,      // Texto visible
                dbStatus: line.status,      // Código interno (ok, warn, alert)
                stats: {
                    occupancy: line.occupation + "%",
                    temp: line.temperature + "°C",
                    motor: line.motor_status
                },
                // Mapeamos los resultados de la flota
                fleet: fleet.map(bus => ({
                    id: bus.code,            // Tu columna 'code'
                    driver: bus.driver_name, // Tu columna 'driver_name'
                    status: bus.status
                }))
            }
        });

    } catch (error) {
        console.error("Error en getLineDetail:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener los detalles de la línea" 
        });
    }
}