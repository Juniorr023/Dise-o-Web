display = document.getElementById("display");
valorDisplay = 0;
op = " ";

function escribir(Event){
    display.value += Event.target.textContent;
}

function operador(Event){
    op = Event.target.textContent;
        valorDisplay = parseFloat(display.value);
        display.value = " ";
}

function calcular(){
    if(op === "+"){
        display.value = valorDisplay + parseFloat(display.value);
    }else if(op === "-"){
        display.value = valorDisplay - parseFloat(display.value);
    }else if( op === "x"){
        display.value = valorDisplay * parseFloat(display.value);
    }else if(op === "/"){
        display.value = valorDisplay / parseFloat(display.value);
    }else{
        display.value = "Eliga una Operacion...";
    }

}




boton0 = document.getElementById("b0");
boton0.addEventListener("click", escribir);

boton1 = document.getElementById("b1");
boton1.addEventListener("click", escribir);

boton2 = document.getElementById("b2");
boton2.addEventListener("click", escribir);

boton3 = document.getElementById("b3");
boton3.addEventListener("click", escribir);

boton4 = document.getElementById("b4");
boton4.addEventListener("click", escribir);

boton5 = document.getElementById("b5");
boton5.addEventListener("click", escribir);

boton6 = document.getElementById("b6");
boton6.addEventListener("click", escribir);

boton7 = document.getElementById("b7");
boton7.addEventListener("click", escribir);

boton8 = document.getElementById("b8");
boton8.addEventListener("click", escribir);

boton9 = document.getElementById("b9");
boton9.addEventListener("click", escribir);

puntito = document.getElementById("punto");
puntito.addEventListener("click", escribir);

boton_suma = document.getElementById("suma");
boton_suma.addEventListener("click", operador);

boton_resta = document.getElementById("resta");
boton_resta.addEventListener("click", operador);

boton_multi = document.getElementById("multi");
boton_multi.addEventListener("click", operador);

boton_div = document.getElementById("div");
boton_div.addEventListener("click", operador);

boton_res = document.getElementById("resultado");
boton_res.addEventListener("click", calcular);