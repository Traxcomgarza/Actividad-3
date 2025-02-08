const express = require('express');
const  app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const fs = require('fs').promises;

async function obtenerTareas() {
  const data = await fs.readFile('tareas.json', 'utf8');
  return JSON.parse(data);
}

async function guardarTareas(tareas) {
  await fs.writeFile('tareas.json', JSON.stringify(tareas));
}


app.use(express.json());

//Funciones
//funcion para leer JSON y obtener datos


async function obtenerTareas() {
const data = await fs.readFile('tareas.json', 'utf8');
return JSON.parse(data);
}

async function guardarTareas(tareas) {
await fs.writeFile('tareas.json', JSON.stringify(tareas));
}

//get
app.get('/',(req,res) => {

res.send('Bienvenido a la app');

var tareas = obtenerTareas();
res.send(`Las tareas actuales son ${tareas} `)

});
//post crear
app.post('/tareas', async(req,res) => {
//const tareaId = parseInt(req.params.id);


let nuevaTarea = req.body

const {titulo, descripcion} = req.body;

var tareas = await obtenerTareas();

const indice = Object.keys(tareas)
var newindice = indice.length > 0 ? Math.max(...indice.map(Number))+1:1;
const tarea = {id: newindice,titulo,descripcion};

tareas.push(tarea);

await guardarTareas(tareas);

res.status(201).send(`La tarea ${titulo} fue creada exitosamente`)
});

//put actualizar
app.put('/:id', async(req,res) => {
const tareaId = parseInt(req.params.id);
var id = [0]
const datosNuevos = req.body;

const tareas = await obtenerTareas();

const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
if (!tareaObjetivo){
res.status(401);
}

tareas[tareaObjetivo] = {...tareas[tareasObjetivo], ...datosNuevos};

await guardarTareas(tareas);

res.json(tareas[tareaObjetivo]);

});


//delate
app.delete('/:id',(req,res) => {

});








app.use("/", (req, res, next) =>{
console.log(`Metodo ${req.method} recibido`)
next()
})