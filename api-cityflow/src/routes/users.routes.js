/**
 * @swagger
 * tags:
 * - name: Login
 */

/**
 * @swagger
 * /api/users:
 * post:
 * tags:
 * - Login
 * summary: Iniciar sesión
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login correcto
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * username:
 * type: string
 * role:
 * type: string
 * 401:
 * description: Credenciales incorrectas
 */

/**
 * @swagger
 * /api/users/register:
 * post:
 * tags:
 * - Login
 * summary: Registrar un nuevo usuario
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: Usuario creado correctamente
 * 400:
 * description: El usuario ya existe o faltan datos
 */

import { Router } from "express";

import express from 'express';
import { login } from '../controllers/users.controller.js'; // Asegúrate de que el path sea correcto


import { 
    
    login,
    register
 } from "../controllers/users.controller.js";

const router = express.Router();



router.post("/", login);
router.post("/register", register);

router.get('/', (req, res) => {
    res.json({ message: "Servicio de usuarios activo. Envía un POST para login." });
});

export default router;