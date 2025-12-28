import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


import usersRoutes from './src/routes/users.routes.js';
import linesRoutes from './src/routes/lines.routes.js';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());


app.use('/api/users', usersRoutes);
app.use('/api/lines', linesRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});