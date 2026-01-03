const API_URL = "http://localhost:4000/api/lines";

async function loadIncidents() {
    try {
        const response = await fetch(`${API_URL}/incidents`);
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
                    <td><span class="prio-${inc.priority.toLowerCase()}">${inc.priority}</span></td>
                    <td>
                        <form onsubmit="saveStatus(event, ${inc.id})">
                            <select id="select-${inc.id}">
                                <option value="pending" ${inc.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="solved" ${inc.status === 'solved' ? 'selected' : ''}>Resuelta</option>
                            </select>
                            <button type="submit">Guardar</button>
                        </form>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) { console.error(error); }
}

async function saveStatus(event, id) {
    event.preventDefault();
    const status = document.getElementById(`select-${id}`).value;
    await fetch(`${API_URL}/incidents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    loadIncidents();
}

document.addEventListener("DOMContentLoaded", loadIncidents);