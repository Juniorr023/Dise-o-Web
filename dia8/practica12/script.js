var audio = document.getElementById("musica");
document.getElementById("btnaudio").addEventListener("click", function(){
    audio.play()
})

var fechaconcierto = new Date("2026-06-19");
function actualizarcontador(){
    var hoy = new Date("2026-06-10");
    var diff = fechaconcierto - hoy;
    var texto;
    var dias = Math.ceil( diff / (1000 * 60 * 60 *24));
    if (dias > 0){
        texto = "Faltan " + dias + " Dias para el Concierto!!!";
    }else {
        texto = "Hoy es el Concierto"
    }
    document.getElementById("contador").innerHTML= texto;
}
actualizarcontador();
setInterval(actualizarcontador, 1000 * 60);