document.addEventListener('DOMContentLoaded', () => {
    
    
    const currentUser = localStorage.getItem("usuario_actual");

    console.log("👤 Cargando historial para:", currentUser);

    loadIncidents(currentUser);
});

async function loadIncidents(username) {
    try {
        const response = await fetch(`http://localhost:4000/api/incidents/user/${username}`);
        const result = await response.json();

        if (result.success) {
            renderTable(result.data);
        } else {
            console.error("Error del servidor:", result.message);
            document.querySelector('.history-table tbody').innerHTML = `<tr><td colspan="5">Error: ${result.message}</td></tr>`;
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al conectar con el servidor para leer las incidencias.");
    }
}

function renderTable(incidents) {
    const tbody = document.querySelector('.history-table tbody');
    tbody.innerHTML = ''; 

    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tienes reportes enviados.</td></tr>';
        return;
    }

    incidents.forEach(inc => {
        let statusClass = 'pending';
        let statusText = 'Pendiente';

        if (inc.status === 'solved') {
            statusClass = 'solved';
            statusText = 'Resuelta';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#REP-${inc.id}</td>
            <td>${inc.date}</td>
            <td>${inc.line}</td>
            <td>${inc.type}</td>
            <td><span class="status-tag ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(row);
    });
}