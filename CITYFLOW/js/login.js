const API_URL = "http://localhost:4000/api/users";

// Escuchamos el evento 'submit' del formulario, no el click del botón
document.getElementById("login-form").addEventListener("submit", async (event) => {
    
    event.preventDefault(); // Evita que la página se recargue

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
    const loginButton = document.getElementById("btn-login");

    // Limpiar mensaje previo
    errorMessage.textContent = "";

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        errorMessage.textContent = "Por favor, introduce usuario y contraseña.";
        return;
    }

    // Efecto visual de carga
    loginButton.textContent = "Entrando...";
    loginButton.disabled = true;

    try {
        const loginData = {
            username: username,
            password: password
        };

        const response = await fetch(API_URL, {  
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            // LOGIN CORRECTO
            console.log("Login exitoso:", data);
            
            // Guardamos datos en el navegador
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            // Redirección según el rol
            if (data.role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            // ERROR DE LOGIN (Usuario o pass incorrectos)
            errorMessage.textContent = data.error || "Usuario o contraseña incorrectos";
            loginButton.textContent = "Entrar";
            loginButton.disabled = false;
        }

    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Error: No se puede conectar con el servidor.";
        loginButton.textContent = "Entrar";
        loginButton.disabled = false;
    }
});