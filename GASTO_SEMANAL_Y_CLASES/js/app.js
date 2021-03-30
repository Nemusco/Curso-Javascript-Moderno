//Clases
class Presupuesto {

    constructor( presupuesto ){
        presupuesto = Number(presupuesto);
        
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    agregarGasto(gasto){
        this.gastos.push(gasto);
        //this.gastos = [...this.gastos,gasto];
        this.calcularRestante(); //asi se llama un metodo dentro de su clase
    }

    calcularRestante(){
        //La funcion reduce recibe un callback que recibe una variable total cuyo valor inicia en 0
        //y el elemento sobre el cual se esta iterando, finalmente reduce retorna la suma entre total y la
        //cantidad de cada gasto
        const gastoTotal = this.gastos.reduce( (total,gasto) => total + gasto.cantidad, 0 );
        //No se le puede restar el gasto total al restante ya que disminuiria muy rapido el presupuesto
        //La resta se hace entre el presupuesto neto y el gasto total que se haya hecho hasta ese momento
        this.restante = this.presupuesto -  gastoTotal;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {

    constructor(){ }

    insertarPresupuesto(info){
        //Extrayendo la informacion
        const { presupuesto, restante } = info;
        
        //Actualizo el html
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    mostrarAlerta(mensaje,tipo){
        const divMensaje = document.createElement("div");
        const primario = document.querySelector(".primario");
        const formulario = document.querySelector("#agregar-gasto");

        divMensaje.classList.add("text-center","alert");
        divMensaje.textContent = mensaje;

        //Los posibles valores para el argumento tipo son danger y success
        divMensaje.classList.add(`alert-${tipo}`);

        //Agrego al html
        primario.insertBefore(divMensaje,formulario);

        setTimeout(() => divMensaje.remove(),2500);
    }

    listarGastos( gastos ){

        limpiarHTML();

        gastos.forEach( elemento => {
            const { gasto, cantidad, id } = elemento;
            
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.dataset.id = id; //Creara un atributo personalizado de nombre data-id
            li.innerHTML = `
                ${gasto} <span class="badge badge-primary badge-pill">${cantidad}</span>
            `;

            const button = document.createElement("button");
            button.classList.add("btn","btn-danger","borrar-gasto");
            button.innerHTML = "Borrar &times";
            //A este boton debo añadirle una funcionalidad cuando de click sobre el
            button.onclick = () => eliminarGasto(id);
            
            li.appendChild(button);
            listaGastos.appendChild(li);

        } );
    }

    actualizarRestante(restante){
        //Este metodo se llama cada vez que se inserte un nuevo gasto
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        //Este metodo cambia el color del contenedor del presupuesto restante segun el porcentaje
        //que nos reste
        const { presupuesto, restante } = presupuestoObj;

        if( (presupuesto / 4) > restante ){
            document.querySelector(".restante").classList.remove("alert-success","alert-warning");
            document.querySelector(".restante").classList.add("alert-danger");
        }
        else if( (presupuesto / 2) > restante ){
            document.querySelector(".restante").classList.remove("alert-success","alert-danger");
            document.querySelector(".restante").classList.add("alert-warning");
        }
        else {
            document.querySelector(".restante").classList.remove("alert-warning","alert-danger");
            document.querySelector(".restante").classList.add("alert-success");
        }
        
        if( restante <= 0 ){
            this.mostrarAlerta("Se ha excedido el presupuesto","danger");
            //La variable formulario esta declarada para el momento en que se llama este metodo
            //por eso no se genera un error
            formulario.querySelector('button[type="submit"]').disabled = true;
            return;
        }

        //Si no me excedo del presupuesto puedo seguir agregando
        formulario.querySelector('button[type="submit"]').disabled = false;
    }
}


//Variables globales
let presupuesto;
const ui = new UI();
const formulario = document.querySelector("#agregar-gasto");
const listaGastos = document.querySelector("#gastos ul");



//Manejadores de eventos
ready();
function ready(){
    document.addEventListener("DOMContentLoaded",obtenerPresupuesto,false);
    formulario.addEventListener("submit",agregarGasto,false);
}

//Funciones
function obtenerPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    //Para convertir una cadena numerica a un numero, ademas de parseInt() y parseFloat() existe Number()
    if( 
        presupuestoUsuario === "" || 
        presupuestoUsuario === null || 
        isNaN(presupuestoUsuario) || 
        presupuestoUsuario <= 0 
    ){
        obtenerPresupuesto();
        return;
    }
    //window.location.reload(); usando este metodo parece que hubiera un parpadeo
    //obtenerPresupuesto(); //Se muestra en todo momento la interfaz pero no puedes interactuar con ella

    //Como ya en esta parte tengo un presupuesto valido puedo instanciar mi clase y mostrar el presupuesto
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

function agregarGasto(e){
    e.preventDefault();

    const gasto = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    if( gasto === "" || cantidad === "" ){
        ui.mostrarAlerta("Todos los campos son obligatorios","danger");
        return;
    }
    else if( isNaN(cantidad) || cantidad <= 0 ){
        ui.mostrarAlerta("La cantidad debe ser un numero y mayor a cero","danger");
        return;
    }

    //Esta sintaxis se le conoce como object enhancement
    //Ahora tendre una propiedad llamada gasto con el input del campo #gasto
    //Tambien tendre una propiedad llamada cantidad con el input del campo #cantidad
    let gastoData = { gasto, cantidad, id:Date.now() }

    presupuesto.agregarGasto(gastoData);
    
    ui.mostrarAlerta("Agregado","success");
    let { gastos, restante } = presupuesto;
    ui.listarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();
    
}

function limpiarHTML(){
    while( listaGastos.firstChild ) listaGastos.removeChild(listaGastos.firstChild);
}

function eliminarGasto(id){
    //Como el objeto presupuesto es una variable global puedo usarlo aqui
    presupuesto.eliminarGasto(id); //Elimino el gasto primero para mostrar informacion actualizada
    const { restante, gastos } = presupuesto;

    ui.listarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}