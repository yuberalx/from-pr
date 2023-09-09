const url = "http://127.0.0.1:8000/api/personaje"
const url2 = "http://127.0.0.1:8000/api/lugar/"
const contenedor = document.querySelector('tbody');
const modalPersonaje = new bootstrap.Modal(document.getElementById('modalPersonaje'))
const formPersonaje = document.querySelector('form')
const nombre = document.getElementById('nombre')
const edad = document.getElementById('edad')
const pais = document.getElementById('pais')
let proceso = ''
let metodo = ''
let respuesta = ''
let lugar = ''

btnCrear.addEventListener('click', () => {
  nombre.value = ''
  edad.value = ''
  pais.value = ''
  console.log("llegaa aqui ")
  modalPersonaje.show()

  proceso = 'crear'
  metodo = 'POST'

})

const verLugar = (idLugar) => {
  return new Promise((resolve, reject) => {
    fetch(url2 + idLugar)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Error al hacer la solicitud. Código de estado: ${response.status}`);
        }
      })
      .then(data => {
        const lugar = data.name_lugar;
        resolve(lugar); // Resuelve la promesa con el lugar
      })
      .catch(error => {
        reject(error); // Rechaza la promesa en caso de error
      });
  });
};

const ver = (personajes) => {
  // console.log(personajes)
  personajes.forEach(personaje => {
    // let hola = verLugar(personaje.lugar_id)
    verLugar(personaje.lugar_id)
      .then(lugar => {
        // Hacer algo con el lugar obtenido, por ejemplo:
        console.log("Lugar:", lugar);
        respuesta += `<tr>
        <td>${personaje.id}</td>
        <td>${personaje.name}</td>
        <td>${personaje.age}</td>
        <td>${lugar+'-'+personaje.lugar_id}</td>

        <td class="text-center"> <a class="btnEditar btn btn-primary">Editar</a> <a class="btnBorrar btn btn-danger">Borrar</a> </td>
    </tr>`
        contenedor.innerHTML = respuesta
      })
      .catch(error => {
        console.error("Error:", error);
      });
  });
}
// Realiza la solicitud GET
fetch(url)
  .then(response => {
    // Verifica si la solicitud fue exitosa (código de estado 200)
    if (response.status === 200) {
      // Convierte la respuesta a JSON
      return response.json();
    } else {
      // Si la solicitud no fue exitosa, lanza un error
      throw new Error(`Error al hacer la solicitud. Código de estado: ${response.status}`);
    }
  })
  .then(data => {
    // Manipula los datos recibidos aquí
    ver(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });

const on = (element, event, selector, handle) => {
  element.addEventListener(event, e => {
    if (e.target.closest(selector)) {
      handle(e)
    }

  })

}
// Borramos el personaje
on(document, 'click', '.btnBorrar', e => {
  const fila = e.target.parentNode.parentNode
  const id = fila.firstElementChild.innerHTML

  alertify.confirm("Confirmar Operacion",
    function () {
      alertify.success('Ok');
      fetch(url + '/' + id, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.status === 200) {
            console.log("Eliminación exitosa");
            location.reload();
          } else {
            throw new Error(`Error al hacer la solicitud. Código de estado: ${response.status}`);
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    },
    function () {
      alertify.error('Cancel');
    });
})

// Editamos personaje
let idFila = 0
on(document, 'click', '.btnEditar', e => {
  const fila = e.target.parentNode.parentNode
  idFila = fila.children[0].innerHTML
  const name = fila.children[1].innerHTML
  const age = fila.children[2].innerHTML
  const lugar = fila.children[3].innerHTML

  nombre.value = name
  edad.value = age
  // pais.value = lugar

  proceso = 'editar'
  metodo = 'PUT'
  modalPersonaje.show()
})

// borrar y editar
formPersonaje.addEventListener('submit', (e) => {
  e.preventDefault()

  if (proceso == 'crear') {
    console.log('Crea');
    // URL del endpoint
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nombre.value,
        age: edad.value,
        lugar_id: pais.value
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        location.reload();
      })
  }

  if (proceso == 'editar') {
    console.log('edita');
    fetch(url + '/' + idFila, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nombre.value,
        age: edad.value,
        lugar_id: pais.value
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        location.reload();
      })
  }
  modalPersonaje.hide()
})