import { openDB } from "../db/db.js";

// Todas las líneas 
export async function getAllLines(req, res) {
    try {
        const db = await openDB();
        const lines = await db.all("SELECT * FROM lines");
        res.status(200).json(lines);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener líneas" });
    }
}

// Detalle de una línea
export async function getLineDetail(req, res) {
    try {
        const { id } = req.params;
        const db = await openDB();
        
        const line = await db.get("SELECT * FROM lines WHERE id = ?", [id]);
        if (!line) return res.status(404).json({ success: false, message: "Línea no encontrada" });

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
                status: displayStatus,
                dbStatus: line.status,
                stats: {
                    occupancy: line.occupation + "%",
                    temp: line.temperature + "°C",
                    motor: line.motor_status
                },
                fleet: fleet.map(bus => ({
                    id: bus.code,
                    driver: bus.driver_name,
                    status: bus.status
                }))
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
}