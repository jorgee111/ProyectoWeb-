const API_URL = "http://localhost:4000/api/incidents"; 

// 1. SEGURIDAD: Verificar si es admin nada más cargar
if (localStorage.getItem("role") !== "admin") {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. BIENVENIDA: Mostrar nombre del usuario (usando la variable correcta)
    const currentUser = localStorage.getItem("usuario_actual") || "Admin";
    const welcomeElement = document.getElementById("welcome-msg");
    if (welcomeElement) {
        welcomeElement.textContent = "Hola, " + currentUser;
    }

    // 3. LOGOUT: Configurar el botón de cerrar sesión
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            localStorage.clear();
            window.location.href = "index.html";
        });
    }

    // 4. CARGAR DATOS: Llamamos a la función principal
    loadIncidents();
});

async function loadIncidents() {
    try {
        const response = await fetch(API_URL);
        const incidents = await response.json();
        
        // Actualizar contadores
        document.getElementById("count-pending").textContent = incidents.filter(i => i.status === 'pending').length;
        document.getElementById("count-solved").textContent = incidents.filter(i => i.status === 'solved').length;

        const tbody = document.getElementById("incidents-tbody");
        tbody.innerHTML = ""; 

        incidents.forEach(inc => {
            const row = `
                <tr>
                    <td>#INC-${inc.id}</td>
                    <td><strong>${inc.line_name}</strong></td>
                    <td>${inc.user_name}</td>
                    <td>${inc.type}</td>
                    <td><span class="prio-${inc.priority ? inc.priority.toLowerCase() : 'normal'}">${inc.priority}</span></td>
                    <td>
                        <form onsubmit="saveStatus(event, ${inc.id})" style="display:flex; gap:5px;">
                            <select id="select-${inc.id}">
                                <option value="pending" ${inc.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="solved" ${inc.status === 'solved' ? 'selected' : ''}>Resuelta</option>
                            </select>
                            <button type="submit" class="btn-save">💾</button>
                        </form>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) { 
        console.error("Error cargando admin:", error); 
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