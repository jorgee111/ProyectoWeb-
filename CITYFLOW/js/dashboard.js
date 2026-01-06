const API_URL = "http://localhost:4000/api/lines";
const container = document.getElementById("lines-container");
const filterSelect = document.getElementById("zone-filter");

// Variable global para guardar los datos y poder filtrar sin recargar
let allLines = [];

document.addEventListener("DOMContentLoaded", async () => {
    
    // Si no hay usuario, mandarlo al login
    const user = localStorage.getItem("usuario_actual");
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // Si todo ok, pedimos las líneas
    await loadLines();
});

//Función para pedir datos al servidor
async function loadLines() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error("Error al conectar con el servidor");
        }

        const data = await response.json();
        
        // Guardamos los datos en la variable global
        allLines = data;
        
        // Pintamos las cartas iniciales (todas)
        renderLines(allLines);

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center; color:red;">Error cargando datos: Asegúrate de que 'node app.js' está encendido.</p>`;
    }
}

// Función para generar el HTML de las cartas
function renderLines(linesToRender) {
    // Limpiamos el contenedor antes de pintar
    container.innerHTML = "";

    if (linesToRender.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%;">No se encontraron líneas con este filtro.</p>`;
        return;
    }

    // Recorremos cada línea y creamos su carta
    linesToRender.forEach(line => {
        
        // Lógica visual para los estados
        let statusClass = "active"; // Verde por defecto
        let statusText = "Operativa";

        if (line.status === "alert") {
            statusClass = "alert"; // Rojo
            statusText = "Incidencia";
        } else if (line.status === "warn" || line.status === "delay") {
            statusClass = "warning"; // Amarillo
            statusText = "Retraso";
        }

        // Creamos el HTML
        const cardHTML = `
            <article class="card">
                <section class="card-header">
                    <span class="line-badge">L-${line.id}</span>
                    <span class="status ${statusClass}">${statusText}</span>
                </section>
                <section class="card-body">
                    <h3>${line.name}</h3>
                    <p><strong>Zona:</strong> ${line.zone}</p>
                    <p><strong>Ocupación:</strong> ${line.occupation}%</p>
                </section>
                <section class="card-footer">
                    <a href="line-detail.html?id=${line.id}" class="btn-detail">Ver Detalles</a>
                </section>
            </article>
        `;

        // Añadimos la carta al grid
        container.innerHTML += cardHTML;
    });
}

// 4. Lógica del Filtro de Zonas
filterSelect.addEventListener("change", (e) => {
    const selectedZone = e.target.value;

    if (selectedZone === "all") {
        renderLines(allLines); // Mostrar todas
    } else {
        // Filtrar array en memoria
        const filtered = allLines.filter(line => line.zone === selectedZone);
        renderLines(filtered);
    }
});

// 5. Cerrar Sesión
document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault(); // Evitar que siga el enlace
    localStorage.clear(); // Borrar datos de sesión
    window.location.href = "index.html"; // Ir al login
});