import { abrirbasededatos } from './funciones.js';

document.addEventListener("DOMContentLoaded", () => {
  const objCliente = {
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
  };

  // Selectores
  const inputNombre = document.querySelector("#nombre");
  const inputEmail = document.querySelector("#email");
  const inputTelefono = document.querySelector("#telefono");
  const inputEmpresa = document.querySelector("#empresa");
  const formulario = document.querySelector("#formulario");
  const submitButton = document.querySelector('input[type="submit"]');
  let db; // Variable para almacenar la base de datos

  // Desactivamos el botón para que el formulario no se envíe sin los datos
  submitButton.disabled = true;

  // Listeners de los selectores
  inputNombre.addEventListener("blur", validar);
  inputEmail.addEventListener("blur", validar);
  inputTelefono.addEventListener("blur", validar);
  inputEmpresa.addEventListener("blur", validar);

  // Utilizamos la función de apertura de base de datos exportada
  abrirbasededatos((database, store) => {
    db = database;

    // Ahora, puedes realizar la transacción dentro de este bloque
    formulario.addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada
      const transaction = db.transaction(['Clientes'], 'readwrite');
      const store = transaction.objectStore('Clientes');

      // Actualiza los valores de objCliente con los campos del formulario
      objCliente.nombre = inputNombre.value.trim();
      objCliente.email = inputEmail.value.trim().toLowerCase();
      objCliente.telefono = inputTelefono.value.trim();
      objCliente.empresa = inputEmpresa.value.trim();

      const request = store.add(objCliente);

      request.onsuccess = function (event) {
        console.log('Cliente agregado a la base de datos');
      };

      request.onerror = function (event) {
        console.error('Error al agregar el cliente a la base de datos');
      };

      // Limpia los campos de entrada
      inputNombre.value = "";
      inputEmail.value = "";
      inputEmpresa.value = "";
      inputTelefono.value = "";
    });
  });

  // Funciones del script
  function validar(e) {
    if (e.target.value.trim() === "") {
      mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
      return;
    }
    submitButton.disabled = false; // Si los datos no están vacíos, se puede enviar el formulario
    limpiarAlerta(e.target.parentElement);
    objCliente[e.target.name] = e.target.value.trim().toLowerCase();
    console.log(objCliente);
  }

  function limpiarAlerta(referencia) {
    const alerta = referencia.querySelector(".bg-red-600");
    if (alerta) {
      alerta.remove();
    }
  }

  function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);

    const error = document.createElement("p");
    error.textContent = mensaje;
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2");
    referencia.appendChild(error);
  }
});
