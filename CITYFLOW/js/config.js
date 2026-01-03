// Este código detecta si estás en local o en la nube automáticamente
const API_BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "https://proyectoweb-1foz.onrender.com/api"; // <-- PEGA AQUÍ TU URL DE RENDER (con el /api al final)

export default API_BASE_URL;