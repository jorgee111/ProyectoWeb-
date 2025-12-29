// src/controllers/users.controller.js
import { openDB } from "../db/db.js";

// 1. LOGIN (POST) - Comprobar credenciales
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const db = await openDB();

        // Buscamos usuario que coincida nombre Y contraseña
        const user = await db.get(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password]
        );

        // Si no existe usuario con esa combinación
        if (!user) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        // Si existe, Login correcto
        res.status(200).json({
            message: "Login correcto",
            username: user.username,
            role: user.role // Importante para redirigir luego
        });

    }  catch (error) {
        console.log("🔴 ERROR:", error); // Esto sale en la terminal


        res.status(500).json({ 
            error: "Error al registrar usuario",
            message: error.message,  // <--- ESTO NOS DIRÁ LA CAUSA
            stack: error.stack       // <--- ESTO NOS DIRÁ DÓNDE
        });
    }
}


export async function register(req, res) {
    const { username, password } = req.body;
    const role = "user";

    // Validación básica
    if (!username || !password) {
        return res.status(400).json({ error: "Faltan datos (usuario o contraseña)" });
    }

    try {
        const db = await openDB();

        // Insertamos en BBDD
        const result = await db.run(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, password, role]
        );

        // Respuesta 201 (Created)
        res.status(201).json({
            message: "Usuario creado correctamente",
            username: username,
            role: role
        });

    } catch (error) {
       
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: "El nombre de usuario ya existe" });
        }
        res.status(500).json({ error: "Error al registrar usuario" });
    }
}