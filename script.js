// Estructura oficial WOD 26.1 proporcionada
const WOD_ESTRUCTURA = [
    { nombre: "20 Wall-ball shots", reps: 20 },
    { nombre: "18 Box jump-overs", reps: 18 },
    { nombre: "30 Wall-ball shots", reps: 30 },
    { nombre: "18 Box jump-overs", reps: 18 },
    { nombre: "40 Wall-ball shots", reps: 40 },
    { nombre: "18 Medicine-ball box step-overs", reps: 18 },
    { nombre: "66 Wall-ball shots", reps: 66 },
    { nombre: "18 Medicine-ball box step-overs", reps: 18 },
    { nombre: "40 Wall-ball shots", reps: 40 },
    { nombre: "18 Box jump-overs", reps: 18 },
    { nombre: "30 Wall-ball shots", reps: 30 },
    { nombre: "18 Box jump-overs", reps: 18 },
    { nombre: "20 Wall-ball shots", reps: 20 }
];

let scores = JSON.parse(localStorage.getItem('atlantisScores')) || [];

function cargarOpcionesWod() {
    const select = document.getElementById('selectEjercicio');
    WOD_ESTRUCTURA.forEach((paso, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = paso.nombre;
        select.appendChild(opt);
    });
}

function toggleInputs() {
    const tipo = document.getElementById('tipoResultado').value;
    document.getElementById('sectionTiempo').style.display = tipo === 'tiempo' ? 'grid' : 'none';
    document.getElementById('sectionReps').style.display = tipo === 'reps' ? 'grid' : 'none';
}

function calcularRepsTotales() {
    const indexActual = parseInt(document.getElementById('selectEjercicio').value);
    const repsExtra = parseInt(document.getElementById('inputRepsExtra').value) || 0;
    
    let acumulado = 0;
    for (let i = 0; i < indexActual; i++) {
        acumulado += WOD_ESTRUCTURA[i].reps;
    }
    return acumulado + repsExtra;
}

function actualizarPrevisualizacionReps() {
    const total = calcularRepsTotales();
    document.getElementById('previewReps').innerText = `Total acumulado: ${total} reps`;
}

function agregarScore() {
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipoResultado').value;
    
    if (!nombre) return alert("Ingresa el nombre del atleta");

    let nuevoScore = {
        id: Date.now(),
        nombre: nombre,
        termino: tipo === 'tiempo'
    };

    if (tipo === 'tiempo') {
        const tiempoVal = document.getElementById('inputTiempo').value;
        if (!tiempoVal.includes(':')) return alert("Usa formato MM:SS (Ej 10:30)");
        nuevoScore.tiempoSegundos = convertirASegundos(tiempoVal);
        nuevoScore.reps = WOD_ESTRUCTURA.reduce((acc, p) => acc + p.reps, 0);
        nuevoScore.display = tiempoVal;
    } else {
        const totalReps = calcularRepsTotales();
        nuevoScore.tiempoSegundos = 99999;
        nuevoScore.reps = totalReps;
        nuevoScore.display = `${totalReps} Reps`;
    }

    scores.push(nuevoScore);
    guardarYActualizar();
    limpiarFormulario();
}

function convertirASegundos(tiempoStr) {
    const partes = tiempoStr.split(':');
    return (parseInt(partes[0]) * 60) + parseInt(partes[1]);
}

function guardarYActualizar() {
    scores.sort((a, b) => {
        if (a.termino && b.termino) return a.tiempoSegundos - b.tiempoSegundos;
        if (a.termino && !b.termino) return -1;
        if (!a.termino && b.termino) return 1;
        return b.reps - a.reps;
    });
    localStorage.setItem('atlantisScores', JSON.stringify(scores));
    mostrarTabla();
}

function mostrarTabla() {
    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = "";
    scores.forEach((s, index) => {
        tbody.innerHTML += `
            <tr>
                <td class="pos-cell">#${index + 1}</td>
                <td>${s.nombre}</td>
                <td>${s.display}</td>
            </tr>`;
    });
}

function limpiarFormulario() {
    document.getElementById('nombre').value = "";
    document.getElementById('inputTiempo').value = "";
    document.getElementById('inputRepsExtra').value = "";
    document.getElementById('previewReps').innerText = "Total: 0 reps";
}

function limpiarTodo() {
    if(confirm("¿Borrar todos los resultados?")) {
        scores = [];
        guardarYActualizar();
    }
}

// Iniciar aplicación
cargarOpcionesWod();
mostrarTabla();