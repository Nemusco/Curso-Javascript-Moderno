/*
    Se crearan 2 objetos: 
    * Procesar los datos para la poliza de seguros
    * Manejar la interfaz de usuario
*/

//Constructor para la poliza de seguro
function Seguro( marca, year, tipo ){
    //En el constructor siempre estare declarando las propiedades estandar de un prototipo
    //Calcular el coste de la poliza de seguro implica cosas como la marca el año del auto y que tan
    //completo quiere el cliente el seguro por eso se toman estos 3 valores
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//No puedo usar arrow functions si voy a manejar propiedades del objeto
Seguro.prototype.cotizar = function () {
    let anios = new Date().getFullYear() - this.year;
    let cotizacion = 3500;

    //Dependiendo de la marca de seguro
    switch(this.marca){
        case "1": cotizacion *= 1.22; break;
        case "2": cotizacion *= 1.09; break;
        case "3": cotizacion *= 1.35; break;
    }

    //Por cada año de viejo el valor de un auto disminuye
    cotizacion -= ((anios * 3) * cotizacion) / 100;
    cotizacion *= (this.tipo === 'basico') ? 1.30 : 1.50;

    return cotizacion;
}

//Fin de la definicion de el objeto Seguro


//Constructor para representar la interfaz de usuario
function UI(){
    //En cambio la interfaz de usuario en esta practica no hace uso de ninguna propiedad
}

UI.prototype.yearInput = () => {
    //Genero e inserto el rango de años
    const years = document.querySelector("#year");
    let max = new Date().getFullYear();

    for( let i=max; i >= (max-21);--i ){
        const opt = document.createElement("option");
        opt.textContent = i;
        opt.value = i;

        years.appendChild(opt);
    }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    //Genero un mensaje de error o de exito cuando se envie el formulario
    const p = document.createElement("p");
    p.textContent = mensaje;

    p.classList.add(tipo,"my-5","p-2");
    //Puedo usar el selector del formulario ya que este es global
    cotizarSeguro.insertBefore(p,document.querySelector("#resultado"));

    setTimeout( () => p.remove(),2500);
}

UI.prototype.mostrarResultado = (seguro,total) => {
    const resultado = document.querySelector('#resultado');
     let marca;
     
     switch(seguro.marca) {
          case '1':
               marca = 'Americano';
               break;
          case '2':
               marca = 'Asiatico';
               break;
          case '3':
               marca = 'Europeo';
               break;
     }
     
     // Crear un div
     const div = document.createElement('div');
     div.classList.add('mt-10')
     
     // Insertar la informacion
     div.innerHTML = `
          <p class='header'>Tu Resumen: </p>
          <p class="font-bold">Marca: <span class="font-normal"> ${marca} </span> </p>
          <p class="font-bold">Año: <span class="font-normal"> ${seguro.year} </span> </p>
          <p class="font-bold">Tipo: <span class="font-normal"> ${seguro.tipo} </span> </p>
          <p class="font-bold"> Total: <span class="font-normal"> $ ${parseInt(total)} </span> </p>
     `;

     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';
     setTimeout( () =>  {
          spinner.style.display = 'none';
          resultado.appendChild(div);
     }, 3000);
}

//Fin de la definicion de el objeto UI

//Programa

//Instancias
const interfaz = new UI();
const cotizarSeguro = document.querySelector("#cotizar-seguro");


document.addEventListener("DOMContentLoaded", () => {
    //Al cargar la pagina se debe mostrar las opciones de año
    interfaz.yearInput();

    //Al cargar la pagina se debe establecer un escucha para el envio del formulario
    cotizarSeguro.addEventListener("submit",validarCotizacion,false);
},false);


//Validare si el usuario completo la informacion
function validarCotizacion(form){
    form.preventDefault();

    const year = form.target.querySelector("#year").value;
    const marca = form.target.querySelector("#marca").value;
    //La sintaxis dentro de este selector es aplicable en css
    //Lo que estoy indicando es que seleccionare el input de nombre tipo que haya sido seleccionado
    const tipo = form.target.querySelector('input[name="tipo"]:checked').value;

    if( year === "" || marca === "" || tipo === "" ){
        interfaz.mostrarMensaje("Te faltan datos por validar","error");
        return;
    }

    interfaz.mostrarMensaje("Todo correcto --- cotizando...","correcto");

    const poliza = new Seguro(marca,year,tipo);

    interfaz.mostrarResultado(poliza,poliza.cotizar());
}



