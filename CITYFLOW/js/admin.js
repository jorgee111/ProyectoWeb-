// CITYFLOW/js/admin.js
const API_URL = "http://localhost:4000/api/lines"; // Ajusta a tu puerto

async function loadIncidents() {
    try {
        const response = await fetch(`${API_URL}/incidents`);
        const incidents = await response.json();
        
        // 1. LÓGICA DE CONTADORES (Faltaba esto)
        // Filtramos el array 'incidents' según el campo 'status' de tu DB
        const pendingCount = incidents.filter(inc => inc.status === 'pending').length;
        const solvedCount = incidents.filter(inc => inc.status === 'solved').length;

        // Actualizamos los números en los cuadros superiores
        document.getElementById("count-pending").textContent = pendingCount;
        document.getElementById("count-solved").textContent = solvedCount;

        // 2. RENDERIZADO DE LA TABLA
        const tbody = document.querySelector(".admin-table tbody");
        tbody.innerHTML = ""; // Limpiar filas previas

        incidents.forEach(inc => {
            // CORRECCIÓN: Usamos 'priority' en lugar de 'prioridad' para que coincida con la DB
            const priorityClass = inc.priority ? inc.priority.toLowerCase() : 'baja';
            
            const row = `
                <tr class="${inc.status === 'solved' ? 'row-done' : ''}">
                    <td>#INC-${inc.id}</td>
                    <td><strong>${inc.line_name}</strong></td>
                    <td>${inc.user_name}</td>
                    <td>${inc.type}</td>
                    <td><span class="prio-${priorityClass}">${inc.priority}</span></td>
                    <td>
                        <form class="action-form" onsubmit="saveStatus(event, ${inc.id})">
                            <select class="status-select" id="select-${inc.id}">
                                <option value="pending" ${inc.status === 'pending' ? 'selected' : ''}>🔴 Pendiente</option>
                                <option value="process" ${inc.status === 'process' ? 'selected' : ''}>🟡 En Proceso</option>
                                <option value="solved" ${inc.status === 'solved' ? 'selected' : ''}>🟢 Resuelta</option>
                            </select>
                            <button type="submit" class="btn-update">Guardar</button>
                        </form>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// 3. ACTUALIZACIÓN DE ESTADO EN LA BBDD
async function saveStatus(event, id) {
    event.preventDefault();
    const newStatus = document.getElementById(`select-${id}`).value;

    try {
        const response = await fetch(`${API_URL}/incidents/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            console.log(`Estado de la incidencia ${id} actualizado a ${newStatus}`);
            loadIncidents(); // Recargamos para actualizar la tabla y los contadores
        } else {
            alert("Error al actualizar el estado en la base de datos");
        }
    } catch (error) {
        console.error("Error en la petición PUT:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadIncidents);