const API = "http://localhost:3001/tasks";

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");

// Cargar tareas desde JSON Server
async function cargarTareas() {
    const respuesta = await fetch(API);
    const tareas = await respuesta.json();

    taskList.innerHTML = "";

    tareas.forEach(tarea => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${tarea.completed ? 'completada' : ''}">${tarea.title}</span>
            <small> (vence: ${tarea.dueDate || "sin fecha"})</small>
            <button class="editar" onclick="editarTarea('${tarea.id}')">Editar</button>
            <button class="eliminar" onclick="eliminarTarea('${tarea.id}')">Eliminar</button>
            <button class="completar" onclick="completarTarea('${tarea.id}', ${tarea.completed})">
                ${tarea.completed ? "Pendiente" : "Completar"}
            </button>
        `;

        taskList.appendChild(li);
    });

    const pendientes = tareas.filter(t => !t.completed).length;
    const completadas = tareas.filter(t => t.completed).length;

    document.getElementById("taskStats").innerText =
        `Pendientes: ${pendientes} | Completadas: ${completadas}`;
}

taskForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nuevaTarea = {
        title: taskInput.value,
        completed: false,
        dueDate: taskDate.value
    };

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaTarea)
    });

    taskInput.value = "";
    taskDate.value = "";
    cargarTareas();
});

async function eliminarTarea(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });
    cargarTareas();
}

async function editarTarea(id) {
    const nuevoTexto = prompt("Editar tarea:");
    if (!nuevoTexto) return;

    await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: nuevoTexto })
    });

    cargarTareas();
}

async function completarTarea(id, estado) {
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: !estado })
    });

    cargarTareas();
}

cargarTareas();

