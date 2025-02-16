// 1
function cargarSalas() {
    fetch('http://127.0.0.1:8000/api/salas/')
        .then(response => response.json())
        .then(data => {
            let tbody = document.getElementById('salas-body');
            tbody.innerHTML = '';
            // 5
            let sala_select = document.getElementById('sala_select');
            sala_select.innerHTML = '';

            data.forEach(sala => {
                let fila = `<tr>
                                <td>${sala.id}</td>
                                <td>${sala.nombre}</td>
                                <td>${sala.capacidad}</td>
                            </tr>`;
                tbody.innerHTML += fila;
                
                // 5
                let sala_opcion = document.createElement("option");
                sala_opcion.value = sala.id;
                sala_opcion.text = sala.nombre;
                sala_select.appendChild(sala_opcion);
            });
        })
        .catch(error => console.error('Error al obtener salas: ', error));
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
                                <td>${reserva.sala}</td>
                                <td>${reserva.hora_inicio}</td>
                                <td>${reserva.hora_fin}</td>
                            </tr>`;
                tbody.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error al obtener reservaciones: ', error));
}

// 3
document.getElementById('reserva-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 4

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
