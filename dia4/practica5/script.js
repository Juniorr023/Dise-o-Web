contenedor = document.getElementById("container");

contenedor.innerHTML = "<button id='cambiar_fondo'> Cambiar a modo dark </button>";

boton = document.getElementById("cambiar_fondo");

boton.addEventListener("click", function() {
    document.body.style.backgroundColor = "lightblue";
});
