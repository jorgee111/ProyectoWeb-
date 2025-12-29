

let map;
const markers = {}; 

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadVehicles(); 
    setInterval(loadVehicles, 5000); // Actualizar cada 5s
});

function initMap() {
    // Coordenadas de Madrid
    const madridCoords = [40.4168, -3.7038];

    // Crear mapa
    map = L.map('map').setView(madridCoords, 13);

    // Cargar capa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // --- FIX DEL MAPA GRIS ---
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

async function loadVehicles() {
    try {
        // Asegúrate de que el puerto sea 4000
        const response = await fetch('http://localhost:4000/api/vehicles');
        const result = await response.json();

        if (result.success) {
            updateMarkers(result.data);
        }
    } catch (error) {
        console.error("Error actualizando flota:", error);
    }
}

function updateMarkers(vehicles) {

    console.log("📡 Datos recibidos del backend:", vehicles);
    vehicles.forEach(bus => {
        if (!bus.location || !bus.location.lat) return;

        // Color del icono según ocupación
        let colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        if (bus.occupancy.level === 'medium') colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
        if (bus.occupancy.level === 'high') colorUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

        const busIcon = new L.Icon({
            iconUrl: colorUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const popupContent = `
            <strong>${bus.code}</strong> (${bus.driver})<br>
            Línea: ${bus.line}<br>
            Ocupación: <b>${bus.occupancy.percent}%</b>
        `;

        if (markers[bus.code]) {
            markers[bus.code].setLatLng([bus.location.lat, bus.location.lng]);
            markers[bus.code].setIcon(busIcon);
            markers[bus.code].setPopupContent(popupContent);
        } else {
            const newMarker = L.marker([bus.location.lat, bus.location.lng], { icon: busIcon })
                .addTo(map)
                .bindPopup(popupContent);
            
            markers[bus.code] = newMarker;
        }
    });
}