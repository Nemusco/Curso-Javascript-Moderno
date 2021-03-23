const btnEnviar = document.querySelector("#enviar");
const btnReset = document.querySelector("#resetBtn");
const spinner = document.querySelector("#spinner");
const mail = document.querySelector("#enviar-mail");
const email = document.querySelector("#enviar-mail #email");
const asunto = document.querySelector("#enviar-mail #asunto");
const mensaje = document.querySelector("#enviar-mail #mensaje");

function main(){
    document.addEventListener("DOMContentLoaded",inicial,false);

    //Blur = difuminar, se va a disparar este evento cuando se presione el input y luego se presione
    //en otro lado
    email.addEventListener("blur",validarFormulario,false);
    asunto.addEventListener("blur",validarFormulario,false);
    mensaje.addEventListener("blur",validarFormulario,false);

    mail.addEventListener("submit",enviarMensaje,false);
    btnReset.addEventListener("click",(e) => {
        mail.reset();
        e.preventDefault();
    },false);
}

function inicial(){
    btnEnviar.disabled = true;
    email.autofocus = true;

    //Esta es la forma correcta para agregar una clase a classList
    btnEnviar.classList.add("cursor-not-allowed","opacity-50");
    
    //La instruccion de abajo genera una cadena de clases separadas por coma lo cual no permite reconocer
    //las clases
    //btnEnviar.classList = [...btnEnviar.classList,"cursor-not-allowed","opacity-50"];
    
    //btnEnviar.classList.push("cursor-not-allowed","opacity-50"); Tambien genera un error ya que push()
    //no es un metodo definido para el arreglo classList
}

function validarFormulario(e){
    const trigger = e.target;
    const regEx = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    //Valido que no este vacío alguno de mis campos, de ser asi aplico los estilos correspondientes
    if( trigger.value.length === 0 ){
        //Remuevo la clase que colorea el campo como correcto y lo coloreo como incorrecto
        changeBorder(trigger,"border-red-500","border-green-500");
        mostrarError("Campo vacío");
    }
    else {
        //Si se ha escrito algo en el campo entonces remuevo el mensaje de error
        let errorMessage = document.querySelector("p.error-message");
        if( errorMessage ) errorMessage.remove();
        
        //Coloreo el campo como correcto
        changeBorder(trigger,"border-green-500","border-red-500");
    }

    //En caso de no estar vacio y ser un email valido que tenga la sintaxis de un email
    if( trigger.type === "email" ){
        //Valido que el valor del campo cumpla con la expresion regular
        //Guarda esa expresion regular de arriba
        if( regEx.test(trigger.value.toLowerCase()) ){
            //Repito el mismo procedimiento en el caso de que ya se haya introducido un correo correcto
            let errorMessage = document.querySelector("p.error-message");
            if( errorMessage ) errorMessage.remove();

            changeBorder(trigger,"border-green-500","border-red-500");
        }
        else{
            //Repito el mismo procedimiento cuando sea un correo invalido
            changeBorder(trigger,"border-red-500","border-green-500");
            mostrarError("Correo electrónico inválido");
        }
    }

    //Esta validacion no funciona
    //email.classList.contains("border-green-500") && asunto.classList.contains("border-green-500") && mensaje.classList.contains("border-green-500")
    
    if( regEx.test(email.value.toLowerCase()) && asunto.value !== "" && mensaje.value !== "" ){
        btnEnviar.disabled = false;
        btnEnviar.classList.remove("cursor-not-allowed","opacity-50");
    }
    else inicial();
}

function mostrarError(message){
    const errores = document.querySelectorAll("#enviar-mail .error-message");

    if( errores.length === 0 ){
        let error = document.createElement("p");
        
        error.classList.add("border","border-red-500","background-red","text-center","error-message","p-3","mb-3");
        error.textContent = message;
        mail.insertBefore(error,spinner);
    }
    else errores[0].textContent = message;
}

function changeBorder(trigger,adding,removing){
    trigger.classList.remove("border",removing);
    trigger.classList.add("border",adding);
}

//Una vez envio el mensaje hago aparecer el spinner 3 segundos, luego lo desaparezco y en su lugar hago
//aparecer un mensaje que me notifica que el mensaje ha sido enviado correctamente, se borra lo escrito
//en los campos y ahora se tendria que volver a escribir otro mensaje
function enviarMensaje(e){
    e.preventDefault();
    spinner.style.display = "flex";

    setTimeout( () => {
        spinner.style.display = "none";

        const p = document.createElement("p");
        p.textContent = "Mensaje Enviado Correctamente!!!";
        p.classList.add("bg-green-500","text-center","p-2","text-white","mb-5");
        mail.insertBefore(p,spinner);

        setTimeout( () => {
            p.remove();
            mail.reset();
            inicial();
        }, 5000 );
    }, 3000);
}

main();