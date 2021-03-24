const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCompras = document.querySelector("#lista-carrito tbody");
const vaciarCarro = document.querySelector("#vaciar-carrito");

let articulos = []; //Necesito llevar el registro de articulos agregados al carrito

function main(){
    listaCursos.addEventListener("click",agregarCurso,false);
    contenedorCompras.addEventListener("click",eliminarArticuloCarrito,false);
    
    //Vaciar completamente el carrito implica vaciar la coleccion de articulos y llamar a limpiarHTML()
    vaciarCarro.addEventListener("click", e => {
        e.preventDefault();
        articulos = [];
        limpiarHTML();
    }, false);

    document.addEventListener("DOMContentLoaded", () => {
        //Uso esta sintaxis en caso de que lo devuelto por localStorage sea nulo 
        articulos = JSON.parse(localStorage.getItem("carrito")) || [];

        //Para que se muestren los articulos almacenados en localStorage apenas carga la pagina
        carritoHTML();
    }, false);
}

function agregarCurso(e){
    /*
        Para prevenir el Event Bubbling al hacer click en cualquier parte de la seccion de cursos 
        utilizo e.target para conocer las propiedades del objeto que dispara el evento y asi validar que este
        sea un boton y no cualquier otra parte de la seccion

        Segundo, el comportamiendo por defecto de un link es el de enviar a una pagina o a una seccion de la pagina
        actual, como su funcion se limita a comportarse como boton entontes uso e.preventDefault() para prevenir su
        comportamiento
    */
    e.preventDefault();
    const trigger = e.target; //Referencia al objeto que dispara el evento
    
    if( trigger.nodeName === "A" && trigger.classList.contains("agregar-carrito") ){
        //Para obtener la informacion del curso que estoy añadiendo demo hacer traversing the DOM hasta el 
        //padre de mi boton de compra y enviar ese elemento completo a una funcion que recoja los datos
        //necesarios
        const curso = trigger.parentElement.parentElement;
        leerDatosCurso(curso);
    }
}

function leerDatosCurso(curso){
    let update = [];

    //Accedo de esta forma a los elementos debido a que mi funcion esta recibiendo un elemento HTML
    //Debe ser manipulado como tal y para seleccionar un elemento HTML  se usa querySelector() o querySelectorAll()
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        nombre: curso.querySelector(".info-card h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        cantidad: 1,
        id: curso.querySelector("a").getAttribute("data-id")
    }

    //Cuando se ejecute leerDatosCurso() se añadira a la coleccion de articulos un nuevo objeto/articulo o
    //se actualizara la cantidad si este articulo existe
    //No puedo olvidar los articulos previamente agregados, por eso copio los articulos ya registrados
    
    if( articulos.some( curso => curso.id === infoCurso.id ) ){
        update = articulos.map( curso => {
            if( curso.id === infoCurso.id ) curso.cantidad++;

            return curso;
        } );

        articulos = [...update];
    }
    else 
        articulos = [...articulos,infoCurso];
    
    carritoHTML(); 
}

function carritoHTML(){
    //Como estare añadiendo todos los elementos en el arreglo debo eliminar previamente lo que 
    //en el HTML
    limpiarHTML();
    
    //Una vez tengo la coleccion de articulos actualizada añado informacion a el contenedor de compras
    articulos.forEach( curso => {
        //Por cada curso creo una fila para la tabla y la añado a el contenedor de compras antes de
        //pasar al siguiente curso
        const row = document.createElement("tr");
        
        //Lo que hago es recorrer cada par ordenado de clave:valor y generar una columna por cada par
        //Agregando la columna a la fila que posteriormente se agregara al contenedor de compras
        Object.entries(curso).forEach( ([key,value]) => {
            const data = document.createElement("td");
            
            data.innerHTML =  ( key === "imagen" ) 
            ? `<img src="${value}" style="width:100px">` 
            : ( key === "id" ) ? `<a href="#" class="borrar-curso" data-id="${value}"> X </a>` : value;
            
            row.appendChild(data);
        } );

        contenedorCompras.appendChild(row);
    } );

    //Almacenando los articulos actuales en localStorage
    almacenamientoLocal();
}

function limpiarHTML(){
    //Mientras todavia existan articulos en el contenedor de compras se iran eliminando
    while( contenedorCompras.firstChild ) contenedorCompras.removeChild(contenedorCompras.firstChild);
}

function eliminarArticuloCarrito(e){
    e.preventDefault();
    //Se puede ejecutar el metodo preventDefault() a un enlace debido a que la propiedad e.preventDefaulted es true

    const trigger = e.target;
    const id = trigger.getAttribute("data-id");

    //Eliminar un articulo del carrito de compras no se trata solamente de borrarlo de la tabla
    //Debe ser borrado directamente de la coleccion de articulos ya que siempre se volveria a cargar el articulo
    //Que se intenta borrar
    articulos = articulos.filter( articulo => articulo.id !== id );
    carritoHTML();
}

function almacenamientoLocal(){
    localStorage.setItem("carrito",JSON.stringify(articulos));
}

main();