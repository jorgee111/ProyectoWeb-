import { openDB } from "../db/db.js";


export async function getAllLines(req, res) {
    try {
        const db = await openDB();

      
        const lines = await db.all("SELECT * FROM lines");

       
        if (lines.length === 0) {
              return res.status(404).json({ 
                error: "No hay líneas registradas en el sistema" 
             });
             
        }

        res.status(200).json(lines);

    } catch (error) {
        console.error(error); 
        res.status(500).json({ 
            error: "Error obteniendo el listado de líneas" 
        });
    }
}


export async function getLineById(req, res) {
    try {
        const id = req.params.id;
        const db = await openDB();

     
        const line = await db.get("SELECT * FROM lines WHERE id = ?", [id]);

     
        if (!line) {
            return res.status(404).json({
                error: "Línea no encontrada"
            });
        }

        res.status(200).json(line);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Error obteniendo el detalle de la línea" 
        });
    }
}