import { openDB } from "../db/db.js";
import bcrypt from "bcrypt"; // Recuperamos la seguridad

export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const db = await openDB();
        const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Comparamos el hash de la BBDD con la pass escrita
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        res.status(200).json({
            message: "Login correcto",
            username: user.username,
            role: user.role // Vital para admin-dashboard.html
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

export async function register(req, res) {
    const { username, password } = req.body;
    try {
        const db = await openDB();
        const hashedPassword = await bcrypt.hash(password, 10); // Encriptamos antes de guardar
        await db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
            [username, hashedPassword]
        );
        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        res.status(400).json({ error: "Error al registrar: posible usuario duplicado" });
    }
}