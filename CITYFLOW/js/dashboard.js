// js/line-detail.js

// 1. Obtener el ID de la línea desde la URL (ej: ?id=1)
const params = new URLSearchParams(window.location.search);
const lineId = params.get("id");

// Elementos del DOM donde vamos a pintar datos
const lineNameEl = document.getElementById("line-name");
const lineStatusEl = document.getElementById("line-status");
const lineZoneEl = document.getElementById("line-zone");
const lineOccupationEl = document.getElementById("line-occupation");
const occupationBarEl = document.getElementById("occupation-bar");
const vehiclesListEl = document.getElementById("vehicles-list");

// Verificar si estamos logueados (Seguridad básica)
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("username")) {
        window.location.href = "login.html";
        return;
    }

    if (!lineId) {
        alert("No se ha especificado ninguna línea.");
        window.location.href = "dashboard.html";
        return;
    }

    loadLineDetails();
    loadVehicles(); // Esta función se quedará pendiente del backend
});

// 2. Cargar detalles de la línea
async function loadLineDetails() {
    try {
        // Petición al backend: GET /api/lines/:id
        const response = await fetch(`http://localhost:4000/api/lines/${lineId}`);
        
        if (!response.ok) throw new Error("Error al cargar la línea");

        const line = await response.json();

        // 3. Pintar datos en pantalla
        lineNameEl.textContent = line.name;
        lineZoneEl.textContent = line.zone;
        
        // Ocupación (Texto y Barra)
        lineOccupationEl.textContent = line.occupation;
        occupationBarEl.style.width = `${line.occupation}%`;

        // Color de la barra según ocupación
        if(line.occupation > 90) occupationBarEl.style.backgroundColor = "red";
        else if(line.occupation > 50) occupationBarEl.style.backgroundColor = "orange";

        // Estado (Badge de color)
        updateStatusBadge(line.status);

    } catch (error) {
        console.error(error);
        lineNameEl.textContent = "Error al cargar datos";
    }
}


function updateStatusBadge(status) {
    let text = "Desconocido";
    let className = "status-badge";

    if (status === "ok" || status === "active") {
        text = "Operativa";
        className += " ok";
    } else if (status === "alert") {
        text = "Incidencia";
        className += " alert";
    } else if (status === "warn" || status === "delay") {
        text = "Retraso";
        className += " warn";
    }

    lineStatusEl.textContent = text;
    lineStatusEl.className = className;
}


async function loadVehicles() {

    vehiclesListEl.innerHTML = `
        <tr>
            <td colspan="3" style="text-align:center; color: #666;">
                <em>🚧 API de Vehículos pendiente de construcción 🚧</em><br>
                Próximo paso: Crear <code>vehicles.controller.js</code>
            </td>
        </tr>
    `;
}


document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "login.html";
});