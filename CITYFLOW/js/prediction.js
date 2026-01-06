
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('trafficForm');
    const resultArea = document.getElementById('resultArea');
    const predictionText = document.getElementById('predictionText');
    const btnPredict = document.getElementById('btnPredict');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

 
        const originalBtnText = btnPredict.textContent;
        btnPredict.textContent = "Procesando...";
        btnPredict.disabled = true;
        btnPredict.style.backgroundColor = "var(--secondary-color)";

       
        const datos = {
            hora: parseInt(document.getElementById('hora').value),
            dia_semana: parseInt(document.getElementById('dia').value),
            humedad: parseFloat(document.getElementById('humedad').value),
            velocidad_viento: parseFloat(document.getElementById('viento').value),
            precipitacion: parseFloat(document.getElementById('lluvia').value)
        };

        try {
    
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (!response.ok) throw new Error("Error en la conexión con la IA");

            const data = await response.json();

            resultArea.classList.remove('hidden');
            predictionText.textContent = data.resultado;


            predictionText.className = "status"; // Reset
            
            // Lógica simple de colores basada en tu dashboard
            if (data.clase === 0) {
                predictionText.classList.add('active'); // Verde
                predictionText.style.color = "var(--success-color)";
            } else if (data.clase === 1) {
                predictionText.classList.add('warning'); // Amarillo/Naranja
                predictionText.style.color = "var(--warning-color)";
            } else {
                predictionText.classList.add('alert'); // Rojo
                predictionText.style.color = "var(--danger-color)";
            }

            // Scroll suave hacia el resultado
            resultArea.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            alert("⚠️ No se pudo conectar con el servicio de IA.\nVerifica que 'main.py' esté ejecutándose.");
        } finally {
            // Restaurar botón
            btnPredict.textContent = originalBtnText;
            btnPredict.disabled = false;
            btnPredict.style.backgroundColor = "var(--primary-color)";
        }
    });
});