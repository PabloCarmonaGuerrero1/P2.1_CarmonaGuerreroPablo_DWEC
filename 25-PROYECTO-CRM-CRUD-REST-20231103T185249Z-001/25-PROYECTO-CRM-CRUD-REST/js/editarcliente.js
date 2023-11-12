import { abrirbasededatos } from './funciones.js';

document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el ID del cliente de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("id");
  const formulario = document.querySelector("#formulario");
  if (!clienteId) {
    console.error("El ID del cliente no se proporcionó en la URL");
    return;
  }

  // Declarar un objeto cliente para almacenar los datos
  let cliente = null;

  // Abre la base de datos utilizando la función exportada
  abrirbasededatos((db, store) => {
    // Obtiene el cliente por ID
    const getRequest = store.get(clienteId);

    getRequest.onsuccess = function (e) {
      cliente = getRequest.result;
      // Rellena los campos de entrada con los datos del cliente
      document.getElementById("nombre").value = cliente.nombre;
      document.getElementById("telefono").value = cliente.telefono;
      document.getElementById("email").value = cliente.email;
      document.getElementById("empresa").value = cliente.empresa;

      // Agregar un evento click al botón de actualización
      formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener el correo electrónico antiguo antes de la actualización
        const antiguoEmail = cliente.email;

        // Actualiza los valores del objeto cliente con los datos de los campos de entrada
        cliente.nombre = document.getElementById("nombre").value;
        cliente.telefono = document.getElementById("telefono").value;
        cliente.email = document.getElementById("email").value;
        cliente.empresa = document.getElementById("empresa").value;

        // Abre una nueva transacción para eliminar el cliente antiguo
        const deleteTransaction = db.transaction(['Clientes'], 'readwrite');
        const deleteStore = deleteTransaction.objectStore('Clientes');
        const deleteRequest = deleteStore.delete(antiguoEmail);

        deleteRequest.onsuccess = function () {
          console.log("Cliente anterior eliminado");
        };

        deleteRequest.onerror = function (e) {
          console.error("Error al eliminar el cliente anterior", e.target.error);
        };

        // Abre una nueva transacción para guardar los cambios
        const updateTransaction = db.transaction(['Clientes'], 'readwrite');
        const updateStore = updateTransaction.objectStore('Clientes');
        const updateRequest = updateStore.put(cliente);

        updateRequest.onsuccess = function () {
          console.log("Cliente actualizado");
        };

        updateRequest.onerror = function (e) {
          console.error("Error al actualizar el cliente", e.target.error);
        };
      });
    };
  });
});
