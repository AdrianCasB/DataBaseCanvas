var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;

/* Inicializamos la base de datos */
function iniciarDB() {
  dataBase = indexedDB.open("gastos", 1);

  dataBase.onupgradeneeded = function (e) {
    active = dataBase.result;
    object = active.createObjectStore("gasto", { keyPath: 'id', autoIncrement: true });
    object.createIndex('por_concepto', 'concepto', { unique: false });

  }

  dataBase.onsuccess = function (e) {
    alert('La base de datos ha sido cargada correctamente');
    leerTodos();
  }

  dataBase.onerror = function (e) {
    alert('Error en la carga de la base de datos');
  }
}

function anadir() {
  var active = dataBase.result;
  var data = active.transaction(["gasto"], "readwrite");
  var object = data.objectStore("gasto");

  var request = object.put({
    concepto: document.querySelector("#concepto").value,
    fecha: document.querySelector("#fecha").value,
    importe: document.querySelector("#importe").value
  });

  request.onerror = function (e) {
    alert(request.error.name + '\n\n' + request.error.message);
  };

  data.oncomplete = function (e) {
    document.querySelector("#concepto").value = '';
    document.querySelector("#fecha").value = '';
    document.querySelector("#importe").value = '';
    alert('Objeto insertado correctamente');
    leerTodos();
  }
}

function leerTodos() {
  var active = dataBase.result;
  var data = active.transaction(["gasto"], "readonly");
  var object = data.objectStore("gasto");
  var elements = [];

  object.openCursor().onsuccess = function (e) {
    var result = e.target.result;
    if (result === null) {
      return;
    }
    elements.push(result.value);
    result.continue();
  }

  data.oncomplete = function () {
    var outerHTML = '';
    for (var key in elements) {
      outerHTML += '\n\
      <tr>\n\
      <td>' + elements[key].concepto + '</td>\n\
      <td>' + elements[key].fecha + '</td>\n\
	  <td>' + elements[key].importe + '</td>\n\
      <td>\n\
	  \n\
	  <button type="button" onclick="baja(' + elements[key].id + ')">Baja</button>\n\
	  <button type="button" onclick="modificar(' + elements[key].id + ')">Modificar</button>\n\
      \n\
      </td>\n\
      </tr>';
    }
    elements = [];
    document.querySelector("#elementsList").innerHTML = outerHTML;
  }
}







function baja(id) {
  var active = dataBase.result;
  var data = active.transaction(["gasto"], "readwrite");
  var object = data.objectStore("gasto");
  if (confirm('¿Está seguro que quiere dar de baja este elemento?')) {
    var request = object.delete(parseInt(id));
  }
  leerTodos();

}

function modificar(id) {
  var active = dataBase.result;
  var data = active.transaction(["gasto"], "readonly");
  var object = data.objectStore("gasto");

  var request = object.get(parseInt(id));
  request.onsuccess = function () {
    var result = request.result;
    if (result !== undefined) {
      document.getElementById("id_modi").value = result.id;
      document.getElementById("concepto_modi").value = result.concepto;
      document.getElementById("fecha_modi").value = result.fecha;
      document.getElementById("importe_modi").value = result.importe;
    }
  }
}

function actualizar() {
  var active = dataBase.result;
  var data = active.transaction(["gasto"], "readwrite");
  var object = data.objectStore("gasto");

  var request = object.put({
    concepto: document.querySelector("#concepto_modi").value,
    fecha: document.querySelector("#fecha_modi").value,
    importe: document.querySelector("#importe_modi").value,
    id: parseInt(document.querySelector("#id_modi").value)
  });

  request.onerror = function (e) {
    alert(request.error.name + '\n\n' + request.error.message);
  };

  data.oncomplete = function (e) {
    document.querySelector("#id_modi").value = '';
    document.querySelector("#concepto_modi").value = '';
    document.querySelector("#fecha_modi").value = '';
    document.querySelector("#importe_modi").value = '';
    alert('Objeto modificado correctamente');
    leerTodos();
  }

}

window.addEventListener('load', iniciarDB, false);























