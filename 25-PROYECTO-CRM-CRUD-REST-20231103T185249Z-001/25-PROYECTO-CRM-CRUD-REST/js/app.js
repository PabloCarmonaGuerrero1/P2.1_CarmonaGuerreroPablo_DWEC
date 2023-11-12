import { abrirbasededatos } from "./funciones.js";

document.addEventListener("DOMContentLoaded", () => {
  abrirbasededatos((db, store) => {
    const listadoClientes = document.getElementById("listado-clientes");

    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = function (event) {
      const cursor = event.target.result;

      if (cursor) {
        const tr = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = cursor.value.nombre;

        const tdTelefono = document.createElement("td");
        tdTelefono.textContent = cursor.value.telefono;

        const tdEmpresa = document.createElement("td");
        tdEmpresa.textContent = cursor.value.empresa;

        const tdAcciones = document.createElement("td");

        // Botón "Borrar"
        const borrarButton = document.createElement("button");
        borrarButton.textContent = "Borrar";
        borrarButton.classList.add("text-red-600", "hover:text-red-900");
        borrarButton.setAttribute("data-cliente-id", cursor.value.email);

        borrarButton.addEventListener("click", function (event) {
          const clienteId = event.target.getAttribute("data-cliente-id");

          // Abre una nueva transacción para eliminar el cliente
          const deleteTransaction = db.transaction(['Clientes'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('Clientes');

          // Elimina el cliente de la base de datos
          const deleteRequest = deleteStore.delete(clienteId);

          // Maneja el evento de éxito al eliminar el cliente
          deleteRequest.onsuccess = function () {
            console.log("Cliente eliminado de la base de datos");

            // Elimina la fila de la lista en la tabla HTML
            listadoClientes.removeChild(tr);
          };

          // Maneja el evento de error al eliminar el cliente
          deleteRequest.onerror = function () {
            console.error("Error al eliminar el cliente de la base de datos");
          };

          // Cierra la transacción de eliminación
          deleteTransaction.oncomplete = function () {
            console.log("Transacción de eliminación completada");
          };
        });

        // Botón "Editar"
        const editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        editarButton.classList.add("text-blue-600", "hover:text-blue-900");
        editarButton.setAttribute("data-cliente-id", cursor.value.email);

        editarButton.addEventListener("click", function (event) {
          const clienteId = event.target.getAttribute("data-cliente-id");
          window.location.href = `editar-cliente.html?id=${clienteId}`;
        });

        // Agrega los elementos de botones a la celda de acciones
        tdAcciones.appendChild(borrarButton);
        tdAcciones.appendChild(editarButton);

        // Agrega las celdas al elemento de fila
        tr.appendChild(tdNombre);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdEmpresa);
        tr.appendChild(tdAcciones);

        // Agrega la fila al elemento de lista de clientes
        listadoClientes.appendChild(tr);

        cursor.continue();
      } else {
        console.log("No hay más registros");
      }
    };
  });
});
