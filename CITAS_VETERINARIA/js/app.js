//Campos del formulario
const mascota = document.querySelector("#mascota");
const propietario = document.querySelector("#propietario");
const telefono = document.querySelector("#telefono");
const fecha = document.querySelector("#fecha");
const hora = document.querySelector("#hora");
const sintomas = document.querySelector("#sintomas");

const formulario = document.querySelector("#nueva-cita");
const _citas = document.querySelector("#citas");

let editando = false;

//Objeto que contendra la data que se vaya insertando
let citaObj = {
    mascota:"",
    propietario:"",
    telefono:"",
    fecha:"",
    hora:"",
    sintomas:""
}

//Clases
class Citas {

    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas,cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id );
    }

    editarCita(citaActualizada){
        //La diferencia entre forEach() y map() es que map itera y retorna elementos
        //Quiero buscar entre las citas a la cita que voy a actualizar, solamente a esta le voy a insertar
        //los cambios, pero tambien me interesa seguir teniendo las demas citas, entonces debo retornar
        //las demas citas de igual manera para conservarlas
        this.citas = this.citas.map( cita => ( cita.id === citaActualizada.id ) ? citaActualizada : cita );
    }
}

class UI {
    mostrarAlerta(mensaje,tipo){
        const divMensaje = document.createElement("div");
        divMensaje.textContent = mensaje;
        divMensaje.classList.add(`alert-${tipo}`,"p-3","text-center","h4","text-white");

        document.querySelector(".container").insertBefore(divMensaje,document.querySelector("#contenido"));

        setTimeout( () => divMensaje.remove(),3000);

    }

    //Como estoy enviando un objeto, puedo aplicar destructuring aqui
    imprimirCitas({citas}){
        this.limpiarHTML();

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement("div");
            divCita.classList.add("cita","p-3");
            divCita.dataset.id = id;

            const mascotaP = document.createElement('h2');
            mascotaP.classList.add('card-title', 'font-weight-bolder');
            mascotaP.innerHTML = `${mascota}`;

            const propietarioP = document.createElement('p');
            propietarioP.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoP = document.createElement('p');
            telefonoP.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaP = document.createElement('p');
            fechaP.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaP = document.createElement('p');
            horaP.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasP = document.createElement('p');
            sintomasP.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn","btn-danger");
            btnEliminar.innerHTML = `Borrar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;

            btnEliminar.onclick = () => eliminarCita(id);

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn","btn-primary");
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
          </svg>`;
            
            btnEditar.onclick = () => editarCita(cita);

            divCita.appendChild(mascotaP);
            divCita.appendChild(propietarioP);
            divCita.appendChild(telefonoP);
            divCita.appendChild(fechaP);
            divCita.appendChild(horaP);
            divCita.appendChild(sintomasP);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            _citas.appendChild(divCita);

        } );
    }

    limpiarHTML(){
        //Elimino las citas impresas antes de agregar nuevas citas
        while( _citas.firstChild ) _citas.removeChild(citas.firstChild);
    }
}


//Instancias
const ui = new UI();
const citasInstancia = new Citas();

//Manejadores de eventos
eventListeners();
function eventListeners(){
    mascota.addEventListener("input",guardarData,false);
    propietario.addEventListener("input",guardarData,false);
    telefono.addEventListener("input",guardarData,false);
    fecha.addEventListener("input",guardarData,false);
    hora.addEventListener("input",guardarData,false);
    sintomas.addEventListener("input",guardarData,false);

    formulario.addEventListener("submit",validar,false);
}

function guardarData(elemento){
    //Esto solo funciona si las propiedades del objeto tienen el mismo nombre que el name de los input
    const input = elemento.target;
    citaObj[input.name] = input.value;
}

function validar(form){
    form.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if( mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "" ){
        ui.mostrarAlerta("Todos los campos son obligatorios","danger");
        return;
    }

    if( editando ){
        //Uso el spread operator para enviar una copia del objeto global, asi evito duplicados
        citasInstancia.editarCita({...citaObj});

        //mostrar mensaje
        ui.mostrarAlerta("Cita editada","success");

        editando = false;
        formulario.querySelector('button[type="submit"]').textContent = "Crear cita";
    }
    else {
        citaObj.id = Date.now();
        
        //El spread operator se puede usar para el paso de objetos/arreglos en una funcion, pasando como
        //parametro una copia del objeto
        citasInstancia.agregarCita({...citaObj});

        //mostrar mensaje
        ui.mostrarAlerta("Cita añadida correctamente","success");
    }

    ui.imprimirCitas(citasInstancia); //Aqui estoy pasando el objeto completo

    //reinicio formulario
    formulario.reset();
}

function reiniciarObjeto(){
    citaObj.mascota = "",
    citaObj.propietario = "",
    citaObj.telefono = "",
    citaObj.fecha = "",
    citaObj.hora = "",
    citaObj.sintomas = ""
    //Al enviar el formulario se esta validando el objeto global, si yo no lo reinicio podre enviar 
    //la misma informacion asi reinicie el formulario
}

function eliminarCita(id){
    //Eliminar cita del objeto
    citasInstancia.eliminarCita(id);
    //Mostrar un mensaje
    ui.mostrarAlerta("Cita eliminada","success");
    //Refrescar citas, puedo pasar el objeto completo ya que se estara aplicando destructuring sobre el
    ui.imprimirCitas(citasInstancia);
}

function editarCita( cita ){
    //Voy a volcar el valor de los campos de la cita a modificar en los campos input de mi formulario
    mascota.value = cita.mascota;
    propietario.value = cita.propietario;
    telefono.value = cita.telefono;
    fecha.value = cita.fecha;
    hora.value = cita.hora;
    sintomas.value = cita.sintomas;

    //Al estar cambiando una cita que ya existe se coloca en citaObj toda la informacion de esa cita
    citaObj.mascota = cita.mascota;
    citaObj.propietario = cita.propietario;
    citaObj.telefono = cita.telefono;
    citaObj.fecha = cita.fecha;
    citaObj.hora = cita.hora;
    citaObj.sintomas = cita.sintomas;
    citaObj.id = cita.id;

    formulario.querySelector('button[type="submit"]').textContent = "Guardar cambios";
    editando = true; //Esta funcion lo que va a hacer es entrar al modo edicion esto significa que
    //esta variable decidira si al enviar el formulario lo que estoy enviando es una nueva cita o una cita existente
}
