export function abrirbasededatos(callback) {
    // Abre una solicitud para acceder a la base de datos "store" con la versión 1
    const openRequest = indexedDB.open("store", 1);
  
    // Maneja el evento de actualización de la base de datos
    openRequest.onupgradeneeded = function (event) {
      // Obtiene la instancia de la base de datos
      const db = event.target.result;
  
      // Si la base de datos no contiene un almacén de objetos llamado 'Clientes', lo crea
      if (!db.objectStoreNames.contains('Clientes')) {
        db.createObjectStore('Clientes', { keyPath: 'email' });
      }
    };
  
    // Maneja el evento de éxito al abrir la base de datos
    openRequest.onsuccess = function (event) {
      // Obtiene la instancia de la base de datos y el objeto store
      const db = event.target.result;
      const store = db.transaction(['Clientes'], 'readwrite').objectStore('Clientes');
  
      // Llama a la función de devolución de llamada con la referencia al objeto store
      callback(db, store);
    };
  
    // Maneja el evento de error al abrir la base de datos
    openRequest.onerror = function () {
      console.error('Error al abrir la base de datos');
    };
  }
  