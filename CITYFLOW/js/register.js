const API_URL = "http://localhost:4000/api/users/register";

// Usamos "submit" en el formulario para que funcione también al pulsar Enter
document.getElementById("register-form").addEventListener("submit", async (event) => {

    event.preventDefault(); // Evita que la página se recargue

    // 1. Obtener los elementos y valores
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageBox = document.getElementById("response-message");
    const submitButton = document.querySelector(".btn-register-blue");

    messageBox.textContent = "";



    if (!username || !password) {
    
        messageBox.textContent = "Por favor, introduce usuario y contraseña.";
        return;
    }


    submitButton.disabled = true;
    submitButton.textContent = "Registrando...";
    submitButton.style.opacity = "0.7";

    try {
        const registerData = {
            username: username,
            password: password
        };


        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

    
        if (response.ok) {
        
            messageBox.textContent = "✅ ¡Cuenta creada! Redirigiendo al login...";

            // Limpiar campos
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } else {
        
            messageBox.textContent = data.error || "Error al registrarse";
            
            
            submitButton.disabled = false;
            submitButton.textContent = "Registrarse en CityFlow";
           
        }

    } catch (error) {
       
        console.error(error);
        
        messageBox.textContent = "Error: No se puede conectar con el servidor.";
        
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.textContent = "Registrarse en CityFlow";
     
    }
});