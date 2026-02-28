// Variables globales
const ciudadInput = document.querySelector("#ciudadInput");
const btnBuscar = document.querySelector("#btnBuscar");
const resultado = document.querySelector("#resultado");
const loader = document.querySelector("#loader");

// TU API KEY de OpenWeatherMap
const API_KEY = "3c188a69b08e0c1ce758ca3856857b69";

// Event listener del botón
btnBuscar.addEventListener("click", () => {
    const ciudad = ciudadInput.value.trim();
    
    if (ciudad === "") {
        mostrarError("Por favor escribe el nombre de una ciudad");
        return;
    }
    
    buscarClima(ciudad);
});

// También buscar al presionar Enter
ciudadInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btnBuscar.click();
    }
});

// Función ASYNC para buscar el clima
async function buscarClima(ciudad) {
    // URL de la API de OpenWeatherMap
    // units=metric para obtener temperatura en Celsius
    // lang=es para descripciones en español
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
    
    // Mostrar loader y limpiar resultado anterior
    loader.style.display = "block";
    resultado.innerHTML = "";

    try {
        const respuesta = await fetch(url);
        
        // Si la ciudad no existe, la API devuelve status 404
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error("Ciudad no encontrada");
            } else {
                throw new Error("Error al obtener los datos del clima");
            }
        }
        
        const datos = await respuesta.json();
        console.log("Datos del clima:", datos);
        
        loader.style.display = "none";
        mostrarClima(datos);
        
    } catch (error) {
        console.error("Error:", error);
        loader.style.display = "none";
        mostrarError(error.message);
    }
}

// Función para mostrar el clima en el DOM
function mostrarClima(datos) {
    // Extraer información relevante
    const ciudad = datos.name;
    const pais = datos.sys.country;
    const temperatura = Math.round(datos.main.temp);
    const sensacion = Math.round(datos.main.feels_like);
    const descripcion = datos.weather[0].description;
    const icono = datos.weather[0].icon;
    const humedad = datos.main.humidity;
    const viento = datos.wind.speed;
    const tempMin = Math.round(datos.main.temp_min);
    const tempMax = Math.round(datos.main.temp_max);
    
    // Construir HTML
    const html = `
        <div class="clima-card">
            <div class="clima-header">
                <h2>${ciudad}, ${pais}</h2>
            </div>
            
            <div class="clima-principal">
                <img 
                    src="https://openweathermap.org/img/wn/${icono}@4x.png" 
                    alt="${descripcion}"
                    class="clima-icono"
                >
                <div class="temperatura-principal">
                    <h1>${temperatura}°C</h1>
                    <p class="descripcion">${descripcion}</p>
                </div>
            </div>
            
            <div class="clima-detalles">
                <div class="detalle">
                    <span class="label">Sensación térmica:</span>
                    <span class="valor">${sensacion}°C</span>
                </div>
                <div class="detalle">
                    <span class="label">Min / Max:</span>
                    <span class="valor">${tempMin}°C / ${tempMax}°C</span>
                </div>
                <div class="detalle">
                    <span class="label">Humedad:</span>
                    <span class="valor">${humedad}%</span>
                </div>
                <div class="detalle">
                    <span class="label">Viento:</span>
                    <span class="valor">${viento} m/s</span>
                </div>
            </div>
        </div>
    `;
    
    resultado.innerHTML = html;
    
    // Limpiar input
    ciudadInput.value = "";
}

// Función para mostrar errores
function mostrarError(mensaje) {
    resultado.innerHTML = `
        <div class="error">
            <p>❌ ${mensaje}</p>
        </div>
    `;
}