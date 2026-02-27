// Variables globales
const galeria = document.querySelector("#galeria");
const btnCargar = document.querySelector("#btnCargar");
const loader = document.querySelector("#loader");

// Event listener del botón
btnCargar.addEventListener("click", () => {
    cargarFotos(10);
});

// Función ASYNC para realizar la petición a la API
async function cargarFotos(cantidad) {
    const urlFotos = `https://jsonplaceholder.typicode.com/photos?_limit=${cantidad}`;
    
    loader.style.display = "block";
    galeria.innerHTML = "";

    try {
        const respuesta = await fetch(urlFotos);
        
        if (!respuesta.ok) {
            throw new Error("Error en la petición");
        }
        
        const fotos = await respuesta.json();
        console.log("Fotos obtenidas:", fotos);
        
        loader.style.display = "none";
        mostrarFotos(fotos);
        
    } catch (error) {
        console.error("Error al cargar las fotos:", error);
        loader.style.display = "none";
        galeria.innerHTML = `<p class="error">Error al cargar las fotos. Intenta de nuevo.</p>`;
    }
}

// Función para mostrar las fotos en el DOM
function mostrarFotos(fotos) {
    let html = "";
    
    fotos.forEach((foto) => {
        const imgUrl = `https://picsum.photos/300/300?random=${foto.id}`;
        
        html += `
            <div class="foto-card">
                <img src="${imgUrl}" alt="${foto.title}">
                <div class="foto-info">
                    <h3>Foto #${foto.id}</h3>
                    <p class="titulo">${foto.title}</p>
                    <p class="album">Álbum: ${foto.albumId}</p>
                </div>
            </div>
        `;
    });
    
    galeria.innerHTML = html;
}