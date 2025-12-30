document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const lineName = urlParams.get('lineName') || "Línea General";


    document.getElementById('line-context').textContent = lineName;

    const form = document.getElementById('incident-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        // Capturamos los valores de los inputs por su ID
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const assistance = document.getElementById('assistance').checked; // true o false

        // Objeto con los datos a enviar
        const incidentData = {
            line_name: lineName,
            type: type,
            description: description,
            assistance: assistance
        };

        try {
            const response = await fetch('http://localhost:4000/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(incidentData)
            });

            const result = await response.json();

            if (result.success) {
                alert("¡Incidencia reportada con éxito!");
                // Redirigir a la página de "Mis Incidencias"
                window.location.href = 'my-incidents.html';
            } else {
                alert("Error: " + result.message);
            }

        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});