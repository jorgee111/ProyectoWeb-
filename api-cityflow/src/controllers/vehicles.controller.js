import { openDB } from "../db/db.js";

// GET: Obtener todos los vehículos con posición y cálculo de ocupación
export async function getAllVehicles(req, res) {
    try {
        const db = await openDB();
        const sql = `
            SELECT 
                v.*, 
                l.name as line_name 
            FROM vehicles v
            JOIN lines l ON v.line_id = l.id
        `;
        
        const vehicles = await db.all(sql);

        // Procesamos cada bus para calcular el % y el color del semáforo
        const processedVehicles = vehicles.map(bus => {
            // Evitar división por cero
            const max = bus.max_occupancy || 1; 
            const current = bus.current_occupancy || 0;
            const percentage = Math.round((current / max) * 100);

            // Determinar nivel para el color del icono
            let occupancyLevel = "low"; // Verde
            if (percentage > 50) occupancyLevel = "medium"; // Amarillo
            if (percentage > 85) occupancyLevel = "high"; // Rojo

            return {
                code: bus.code,          // Ej: BUS-101
                driver: bus.driver_name, // Ej: Roberto G.
                line: bus.line_name,     // Ej: Línea 1 - Roja
                location: {
                    lat: bus.latitude,
                    lng: bus.longitude
                },
                occupancy: {
                    current: current,
                    max: max,
                    percent: percentage,
                    level: occupancyLevel
                }
            };
        });

        res.status(200).json({
            success: true,
            data: processedVehicles
        });

    } catch (error) {
        console.error("Error en vehicles controller:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al obtener la flota" 
        });
    }
}