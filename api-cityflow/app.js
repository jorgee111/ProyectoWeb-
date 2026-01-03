import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import usersRoutes from './src/routes/users.routes.js';
import linesRoutes from './src/routes/lines.routes.js'; 
import detailsRoutes from './src/routes/details.routes.js'; 
import incidentsRoutes from './src/routes/incidents.routes.js';
import vehiclesRoutes from './src/routes/vehicles.routes.js';
import { openDB } from './src/db/db.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

openDB();

// Registro de rutas corregido
app.use('/api/users', usersRoutes); 
app.use('/api/lines', linesRoutes); 
app.use('/api/details', detailsRoutes); 
app.use('/api/incidents', incidentsRoutes); // Ruta para la tabla del admin
app.use('/api/vehicles', vehiclesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor CityFlow corriendo en http://localhost:${PORT}`);
});