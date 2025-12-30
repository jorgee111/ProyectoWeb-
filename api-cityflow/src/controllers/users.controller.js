import { openDB } from "../db/db.js";
import bcrypt from "bcrypt"; // Importación necesaria 

const saltRounds = 10; // Nivel de seguridad para el encriptado

// 1. LOGIN (POST) - Comprobar credenciales de forma segura
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const db = await openDB();

        // Buscamos al usuario SOLO por nombre (no podemos comparar el hash en el SQL)
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        // Si el usuario no existe
        if (!user) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        // Comparamos la contraseña enviada con el hash guardado en la BBDD 
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        // Login correcto: Enviamos datos de sesión (Requisito 1) [cite: 7]
        res.status(200).json({
            message: "Login correcto",
            username: user.username,
            role: user.role // Admin o User [cite: 11]
        });

    } catch (error) {
        console.log("🔴 ERROR:", error);
        res.status(500).json({ error: "Error en el servidor al intentar loguear" });
    }
}

// 2. REGISTER (POST) - Crear nuevo usuario con contraseña encriptada
export async function register(req, res) {
    const { username, password } = req.body;
    const role = "user"; 

    if (!username || !password) {
        return res.status(400).json({ error: "Faltan datos (usuario o contraseña)" });
    }

    try {
        const db = await openDB();

        // Hasheamos la contraseña antes de guardarla 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertamos el HASH en la BBDD, nunca la contraseña real
        await db.run(
            `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hashedPassword, role]
        );

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