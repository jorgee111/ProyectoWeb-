document.addEventListener('DOMContentLoaded', () => {
    //Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const lineId = urlParams.get('id');

    if (!lineId) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Cargar datos
    fetchLineData(lineId);
});

async function fetchLineData(id) {
    try {
        const response = await fetch(`http://localhost:4000/api/lines/${id}`);
        const result = await response.json();

        if (result.success) {
            updateUI(result.data);
        } else {
            console.error('Error API:', result.message);
            document.querySelector('.detail-header h1').textContent = "Línea no encontrada";
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

function updateUI(line) {
    // Actualizar Cabecera
    
    document.querySelector('.detail-header h1').textContent = `${line.name} (${line.zone})`;

    // Actualizar Badge de Estado y Color
    const badge = document.querySelector('.badge-status');
    badge.textContent = line.status; // "Operativa", "Incidencia", etc.


    badge.className = 'badge-status'; // Limpiar clases previas
    if (line.dbStatus === 'alert') {
        badge.style.backgroundColor = '#e74c3c'; // Rojo
    } else if (line.dbStatus === 'warn') {
        badge.style.backgroundColor = '#f1c40f'; // Amarillo
        badge.style.color = '#333'; // Texto oscuro para contraste
    } else {
        badge.style.backgroundColor = '#2ecc71'; // Verde (Default)
        badge.style.color = '#fff';
    }

    // Actualizar Estadísticas (Ocupación, Temperatura, Motor)
    const statsValues = document.querySelectorAll('.stat-box h3');
    if(statsValues.length >= 3) {
        statsValues[0].textContent = line.stats.occupancy;
        statsValues[1].textContent = line.stats.temp; 
        statsValues[2].textContent = line.stats.motor;
    }

    //Generar la Tabla de Flota
    const tbody = document.querySelector('.flota-table tbody');
    tbody.innerHTML = ''; // Borrar datos de ejemplo del HTML

    line.fleet.forEach(bus => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bus.id}</td>     <td>${bus.driver}</td> <td>${bus.status}</td> `;
        tbody.appendChild(row);
    });

    const reportBtn = document.querySelector('.btn-report');
    if (reportBtn) {
        // encodeURIComponent es vital para que los espacios y acentos no rompan la URL
        reportBtn.href = `create-incident.html?lineName=${encodeURIComponent(line.name)}`;
    }

}