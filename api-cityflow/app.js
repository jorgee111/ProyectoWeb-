import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


import usersRoutes from './src/routes/users.routes.js';
import linesRoutes from './src/routes/lines.routes.js'; // <--- OJO: Debe llamarse lines.routes.js


import { openDB } from './src/db/db.js';

const app = express();
const PORT = 4000;


app.use(cors());
app.use(bodyParser.json());


openDB();


app.use('/api/users', usersRoutes); // Login y Registro
app.use('/api/lines', linesRoutes); // Dashboard y Detalles


app.listen(PORT, () => {
    console.log(`Servidor CityFlow corriendo en http://localhost:${PORT}`);
});