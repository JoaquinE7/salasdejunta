// 1
function cargarSalas() {
    fetch('http://127.0.0.1:8000/api/salas/')
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById('salas-body');
            tbody.innerHTML = '';
            // 4
            let sala_select = document.getElementById('sala_select');
            sala_select.innerHTML = '';

            data.forEach(sala => {
                let fila = `<tr>
                                <td>${sala.id}</td>
                                <td>${sala.nombre}</td>
                                <td>${sala.capacidad}</td>
                                <td>
                                    <button onclick="editarSala(${sala.id})" class="btn btn-info">Editar</button>
                                    <button onclick="eliminarSala(${sala.id})" class="btn btn-danger">Eliminar</button>
                                </td>
                            </tr>`;
                tbody.innerHTML += fila;
                
                // 4
                let sala_opcion = document.createElement("option");
                sala_opcion.value = sala.id;
                sala_opcion.text = sala.nombre;
                sala_select.appendChild(sala_opcion);
            });
        })
        .catch(error => console.error('Error al obtener salas: ', error));
}

// 5
document.getElementById('crear-sala-btn').addEventListener('click', function() {
    document.getElementById('crear-sala-modal').style.display = 'block';
});

// 6
document.getElementById('cerrar-modal').addEventListener('click', function() {
    document.getElementById('crear-sala-modal').style.display = 'none';
});
// 6
document.getElementById('cerrar-mod-modal').addEventListener('click', function() {
    document.getElementById('modificar-sala-modal').style.display = 'none';
});

// 7
document.getElementById('crear-sala-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let nombre = document.getElementById('nombre').value;
    let capacidad = document.getElementById('capacidad').value;

    let datos = {
        nombre: nombre,
        capacidad: capacidad
    };

    fetch('http://127.0.0.1:8000/api/salas/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        alert('Sala creada correctamente');
        cargarSalas();
        document.getElementById('crear-sala-modal').style.display = 'none';
    })
    .catch(error => console.error('Error al crear la sala:', error));
});

// 8
function editarSala(id) {
    document.getElementById('modificar-sala-modal').style.display = 'block';

    fetch(`http://127.0.0.1:8000/api/salas/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('titulo_sala').innerHTML = `Modificar ${data.nombre}`;
            document.getElementById('id_sala').value = id;
            document.getElementById('nombre_modificar').value = data.nombre;
            document.getElementById('capacidad_modificar').value = data.capacidad;
        })
        .catch(error => console.error('Error al obtener sala: ', error));
}

// 9
document.getElementById('modificar-sala-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let id = document.getElementById('id_sala').value;
    let nombre = document.getElementById('nombre_modificar').value;
    let capacidad = document.getElementById('capacidad_modificar').value;

    let datos = {
        nombre: nombre,
        capacidad: capacidad
    };

    fetch(`http://127.0.0.1:8000/api/salas/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        alert('Sala modificada correctamente');
        cargarSalas();
        document.getElementById('modificar-sala-modal').style.display = 'none';
    })
    .catch(error => console.error('Error al modificar la sala:', error));
});

// 10
function eliminarSala(id) {
    if (confirm('¿Estas seguro de que quieres eliminar esta sala?')) {
        fetch(`http://127.0.0.1:8000/api/salas/${id}/`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Sala eliminada correctamente');
                cargarSalas();
            } else {
                alert('Error al eliminar la sala');
            }
        })
        .catch(error => console.error('Error al eliminar la sala:', error));
    }
}



// 2
function cargarReservas() {
    fetch('http://127.0.0.1:8000/api/reservaciones/')
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById('reservas-body');
            tbody.innerHTML = '';
            data.forEach(reserva => {
                let fila = `<tr>
                                <td>${reserva.id}</td>
                                <td name="sala_id_${reserva.sala}"></td>
                                <td>${reserva.hora_inicio}</td>
                                <td>${reserva.hora_fin}</td>
                                <td>
                                    <button onclick="liberarSala(${reserva.id})" class="btn btn-danger">Liberar</button>
                                </td>
                            </tr>`;
                tbody.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error al obtener reservaciones: ', error));
        
        // 12
        fetch('http://127.0.0.1:8000/api/salas/')
        .then(response => response.json())
        .then(data => {
            data.forEach(sala => {
                let elementos = document.querySelectorAll(`td[name="sala_id_${sala.id}"]`);
                elementos.forEach(td => {
                    td.innerHTML = sala.nombre;
                });
            });
        })
        .catch(error => console.error('Error al obtener salas: ', error));
}

// 11
function liberarSala(id) {
    if (confirm('¿Estas seguro de que quieres liberar esta sala?')) {
        fetch(`http://127.0.0.1:8000/api/reservaciones/${id}/`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Sala liberada correctamente');
                cargarReservas();
            } else {
                alert('Error al liberar la sala');
            }
        })
        .catch(error => console.error('Error al liberar la sala:', error));
    }
}

// 3
document.getElementById('reserva-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let salaId = document.getElementById('sala_select').value;
    let horaInicio = document.getElementById('inicio').value;
    let horaFin = document.getElementById('fin').value;

    let datos = {
        sala: parseInt(salaId),
        hora_inicio: new Date(horaInicio).toISOString(),
        hora_fin: new Date(horaFin).toISOString()
    };

    fetch('http://127.0.0.1:8000/api/reservaciones/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Sala reservada correctamente');
            cargarReservas();
        }
    })
    .catch(error => console.error('Error al reservar:', error));
});



cargarSalas();
cargarReservas();
