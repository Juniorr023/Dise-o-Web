var telefono = +595983738724;

var productos = document.querySelectorAll(".producto");

productos.forEach(function(producto){
    producto.addEventListener("click", function(){
        var nombre = producto.getAttribute("data-nombre");
        var mensaje = "Hola, me interesa: " + nombre;
        var url = "https:wa.me/" + telefono + "? text" + encodeURIComponent(mensaje);
        window.open(url,"_blank");
    });
});