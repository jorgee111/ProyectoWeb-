const API_URL = "http://localhost:4000/api/incidents"; 

// 1. SEGURIDAD
if (localStorage.getItem("role") !== "admin") {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = localStorage.getItem("usuario_actual") || "Admin";
    const welcomeElement = document.getElementById("welcome-msg");
    if (welcomeElement) welcomeElement.textContent = "Hola, " + currentUser;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "index.html";
        });
    }

    loadIncidents();
});

async function loadIncidents() {
    try {
        const response = await fetch(API_URL);
        const incidents = await response.json();
        
        document.getElementById("count-pending").textContent = incidents.filter(i => i.status === 'pending').length;
        document.getElementById("count-solved").textContent = incidents.filter(i => i.status === 'solved').length;

        const tbody = document.getElementById("incidents-tbody");
        tbody.innerHTML = ""; 

        incidents.forEach(inc => {
            // AÑADIDO: Botón de eliminar con clase 'btn-delete'
            const row = `
                <tr>
                    <td>#INC-${inc.id}</td>
                    <td><strong>${inc.line_name}</strong></td>
                    <td>${inc.user_name}</td>
                    <td>${inc.type}</td>
                    <td><span class="prio-${inc.priority ? inc.priority.toLowerCase() : 'normal'}">${inc.priority}</span></td>
                    <td>
                        <section style="display:flex; gap:10px; align-items:center;">
                            <form onsubmit="saveStatus(event, ${inc.id})" style="display:flex; gap:5px;">
                                <select id="select-${inc.id}">
                                    <option value="pending" ${inc.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                    <option value="solved" ${inc.status === 'solved' ? 'selected' : ''}>Resuelta</option>
                                </select>
                                <button type="submit" class="btn-save" title="Guardar estado">💾</button>
                            </form>
                            
                            <button onclick="deleteIncident(${inc.id})" class="btn-delete" title="Eliminar incidencia">🗑️</button>
                        </section>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) { 
        console.error("Error cargando admin:", error); 
    }
}

// FUNCION PARA ELIMINAR
async function deleteIncident(id) {
    // Confirmación para evitar clicks accidentales
    const confirmDelete = confirm("⚠️ ¿Estás seguro de que quieres eliminar esta incidencia permanentemente?");
    
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (data.success) {
            alert("Incidencia eliminada");
            loadIncidents(); // Recargamos la tabla
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión al eliminar");
    }
}

async function saveStatus(event, id) {
    event.preventDefault();
    const status = document.getElementById(`select-${id}`).value;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        
        loadIncidents();
        alert("Estado actualizado");
        
    } catch (error) {
        console.error(error);
        alert("Error al guardar");
    }
}