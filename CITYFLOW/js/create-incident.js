document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const lineName = urlParams.get('lineName') || "Línea General";

    // Mostramos en el título sobre qué línea estamos reportando
    document.getElementById('line-context').textContent = lineName;

    const form = document.getElementById('incident-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // Recuperamos quién está conectado
        const currentUser = localStorage.getItem("usuario_actual") || "barbe";

        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const assistance = document.getElementById('assistance').checked; 

        const incidentData = {
            line_name: lineName,
            user_name: currentUser,
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
                alert("¡Incidencia reportada con éxito por " + currentUser + "!");
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