let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el div actual segun el tab al que se presiona
    mostarSeccion();

    // oculta o muestra el tab al cual se presiona
    cambiarSeccion();

    // paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //compuebra la pagina actual para olcultar la paginacion
    botonesPaginador();

    // muestra el resmen de la cita o el mensaje de error
    mostrarResumen();

    //alamcena el nombre de la cita en el objeto
    nombreCita();

    //almacena fecha
    fechaCita();

    //desabilita las fechas anteriores
    desabilitarFechaAnterior();

    //almacena la hora de la cita
    horaCita();
}

function mostarSeccion() {

    //eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if ( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    
    // resalta el tab actual 
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlaces => {
        enlaces.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //lamar la funcion de mostrar seccion
            mostarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //generar el HTML 
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            //DOM scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //generar precio 
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}` ;
            precioServicio.classList.add('precio-servicio');

            //Generar Div contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio
            servicioDiv.onclick = seleccionarServicio;

            // inyectar precio y nombre
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    
    let elemento;
    // forzar que el elemento al cual le damos click sea div
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
    
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        console.log(pagina);

        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        console.log(pagina);
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la pagina 3, carga el resumen
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostarSeccion();// Camnbia la seccion que se muestra
}

function mostrarResumen() {
    //distructuring
    const { nombre, fecha, hora, servicios} = cita;

    // seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el html previo
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    //validacion de objeto
    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'faltan datos de servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;
    } 

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    //mostrar el resumen  
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} hrs`;

    const serviciosCita = document.createElement('div');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //iterrar sobre el arreglo de servicios
    servicios.forEach( servicio => {

        const{ nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        //console.log(parsInt(totalServicio[1].trim()));

        cantidad += parseInt(totalServicio[1].trim());

        // colocar texto y precio en el DIV
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    } );

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //validacion de texto 
        if( nombreTexto === '' || nombreTexto.length < 4) {
            mostrarAlerta('nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    // si hay una alerta previa, entonces no agregar otra
    const alertaPrevia = document.querySelector('.alerta')
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    //insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta );

    //eliminar la alerta despues de tres s
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();

        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('fines de semana no son validos', 'error');
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }
    });
}

function desabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    //formato deseado : AAAA-MM-DD

    if (dia < 10 ) {
        const fechaDeshabilitar = `${year}-${mes}-0${dia}`;
        inputFecha.min = fechaDeshabilitar;
    } else if (mes < 10) {
        const fechaDeshabilitar = `${year}-0${mes}-${dia}`;
        inputFecha.min = fechaDeshabilitar;
    } else if (dia < 10 || mes < 10) {
        const fechaDeshabilitar = `${year}-0${mes}-0${dia}`;
        inputFecha.min = fechaDeshabilitar;
    } else {
        const fechaDeshabilitar =  `${year}-${mes}-${dia}`;
        inputFecha.min = fechaDeshabilitar;
    }
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2500);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}
