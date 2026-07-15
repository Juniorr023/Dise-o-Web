document.getElementById("formulario").addEventListener("submit", (e) =>{
    e.preventDefault();
    document.getElementById("mensaje").textContent="Formulario Enviado Correctamente"

        document.getElementById("mensaje").value=" ";
});
