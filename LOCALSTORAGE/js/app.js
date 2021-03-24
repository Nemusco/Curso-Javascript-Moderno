const formulario = document.querySelector("#formulario");
const listaTweets = document.querySelector("#lista-tweets");

let tweets = [];

document.addEventListener("DOMContentLoaded",done,false);

function done(){
    formulario.addEventListener("submit",almacenarTweet,false);

    tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    mostrarTweets();
}

function almacenarTweet(element){
    element.preventDefault();

    const textarea = element.target.querySelector("#tweet").value;

    if( textarea === "" ){
        mostrarError("No se puede agregar un tweet vacío");
        return;
    }

    let tweet = {
        id: Date.now(),
        text: textarea
    }

    tweets = [...tweets,tweet];

    mostrarTweets();
    formulario.reset();
}

function mostrarError(error){
    const contenido = document.querySelector("#contenido");
    const p = document.createElement("p");
    p.classList.add("error");
    p.textContent = error;

    contenido.appendChild(p);

    setTimeout( () => p.remove(), 2500 );
}

function mostrarTweets(){
    limpiarHTML();

    tweets.forEach( tweet => {
        let {id,text} = tweet;
        const li = document.createElement("li");
        const a = document.createElement("a");
        
        a.classList.add("borrar-tweet");
        a.textContent = "X";
        a.onclick = () => {
            eliminarTweet(id);
        }

        li.textContent = text;
        li.appendChild(a);

        listaTweets.appendChild(li);
    });

    guardar();
}

function limpiarHTML(){
    while( listaTweets.firstChild ) listaTweets.removeChild(listaTweets.firstChild);
}

function guardar(){
    localStorage.setItem("tweets",JSON.stringify(tweets));
}

function eliminarTweet(id){
    tweets = tweets.filter( (tweet) => tweet.id !== id );

    mostrarTweets();
}