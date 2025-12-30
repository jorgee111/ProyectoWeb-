document.addEventListener('DOMContentLoaded', () => {
    // Como aún no tenemos login real, simulamos que somos este usuario
    const currentUser = "Conductor_Demo";

    loadIncidents(currentUser);
});

async function loadIncidents(username) {
    try {
        const response = await fetch(`http://localhost:4000/api/incidents/user/${username}`);
        const result = await response.json();

        if (result.success) {
            renderTable(result.data);
        } else {
            console.error("Error:", result.message);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

function renderTable(incidents) {
    const tbody = document.querySelector('.history-table tbody');
    tbody.innerHTML = ''; // Limpiamos las filas estáticas de ejemplo

    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No tienes reportes enviados.</td></tr>';
        return;
    }

    incidents.forEach(inc => {
        // Determinamos la clase CSS y el texto según el estado
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
            <td>
                <span class="status-tag ${statusClass}">${statusText}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}