const resultado = document.querySelector("#resultado");
const year = document.querySelector("#year");
const buscador = document.querySelector("#buscador");

let busqueda = {
    marca:"",
    modelo:"",
    year:"",
    transmision:"",
    puertas:"",
    minimo:"",
    maximo:"",
    color:""
}

document.addEventListener("DOMContentLoaded",() => {
    mostrarAutos(autos); //Mostrara todos los autos registrados en db.js

    selectYear(); //Llenara la lista de filtrado por año

    //Intentare detectar cual select de mi formulario buscador ha cambiado...
    buscador.addEventListener("change",actualizarBusqueda,false);
}, false);


function mostrarAutos(autos){
    //Antes de mostrar los resultados debo limpiar el html previo
    limpiarHTML();

    autos.forEach( auto => {
        const p = document.createElement("p");
        const { marca, modelo, color, year, transmision, puertas, precio } = auto; //Object destructuring

        p.textContent = `
            ${marca} - ${modelo} - Color: ${color} - Año: ${year} - Transmisión: ${transmision} - Puertas: ${puertas} - Precio: ${precio}$.
        `;//Creo un parrafo con la informacion de cada carro

        p.textContent.trim(); //Elimino los espacios al inicio y final de mi texto
        resultado.appendChild(p); //Añado a mi contenedor de resultados
    });
}

function selectYear(){
    let max = new Date().getFullYear(); //Me proporciona el año actual, este codigo se actualiza por si solo
    let min = max - 10; //Solo quiero mostrar autos modernos

    for( let i=max; i >= min;--i ){
        const opt = document.createElement("option");
        opt.value = i; //La propiedad value y el texto deben tener el mismo valor
        opt.textContent = i;

        year.appendChild(opt);
    }
}

function actualizarBusqueda( select ){
        let filtro = select.target.getAttribute("id");
        
        //Verifico si el select contiene un valor de string numerico, de ser asi lo convierto a entero
        let valor = ( filtro === "year" || filtro === "puertas" || filtro === "precio" )
        ? parseInt(select.target.value)
        : select.target.value;

        let resultados = [];
    
        //Esta forma se va directamente a la propiedad correcta y guarda el valor en ella...
        //Pero esto solo es posible si tengo un atributo(en este caso el id) con el mismo nombre de las propiedades
        //en cada select

        //Otra forma podia ser crear un selector(querySelector()) para cada campo select y añadirles
        //un escucha al evento change, habria sido redundante y repetiria las mismas lineas de codigo para
        //cada campo...
        for(let propiedad in busqueda)
            if( filtro === propiedad ) busqueda[propiedad] = valor;
        
        //busqueda.filtro = valor; Esta instruccion me genera un campo de nombre filtro... No sirve
    
        //Filtro los autos con una funcion de alto nivel, son funciones que llaman a otras funciones
        //Al colocar el nombre de la funcion, automaticamente recibo el auto sobre el cual se esta
        //iterando
        resultados = autos.filter( actualizarResultados );
    
        //Cuando carga la pagina se muestran todos los autos, pero ahora se van a mostrar los que se filtraron
        //con la busqueda...
        
        if( resultados.length === 0 ){
            noAutos();
            return;
        }

        mostrarAutos(resultados);
}

//Esta funcion establece el criterio para descartar los autos cuyas propiedades no tengan el mismo valor
//que las propiedades definidas del objeto busqueda
function actualizarResultados(auto){
    
    for( let propiedad in busqueda  ){
        if( busqueda[propiedad] ){
            if( propiedad === "minimo" || propiedad === "maximo" ){
                let {minimo,maximo} = busqueda;
                minimo = ( minimo ) ? parseInt(minimo) : 0;
                maximo = ( maximo ) ? parseInt(maximo) : 100000;

                if( !(auto.precio >= minimo && auto.precio <= maximo) ) return false;
            }
            else
                if( auto[propiedad] !== busqueda[propiedad] ) return false;
        }
    }
    
    //Si yo no tengo ningun filtro definido entonces todos mis autos se van a mostrar ya que filter
    //recibe un true por parte de esta funcion al igual que si un auto coincidiera con todos los filtros
    //de mi busqueda

    return true;
}

function limpiarHTML(){
    while( resultado.firstChild ) resultado.removeChild(resultado.firstChild);
}

function noAutos(){
    limpiarHTML();

    const p = document.createElement("p");
    p.textContent = "No se obtuvieron resultados. Te sugerimos intentar con otros terminos de busqueda";
    p.classList.add("alerta","error");
    
    resultado.appendChild(p);
}
