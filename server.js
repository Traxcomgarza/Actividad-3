const express = require('express');
const { findSourceMap } = require('module');
const  app = express();
const PORT = 3000;
const fs = require('fs').promises;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`servidor corriendo en: http://localhost:${PORT}`);
});


async function obtenerTareas() {
  try {
      const data = await fs.readFile('tareas.json', 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error al leer el archivo', error);
      throw error;
  }
}

async function guardarTareas(tareas) {
  try {
      const data = JSON.stringify(tareas, null, 2);
      await fs.writeFile('tareas.json', data, 'utf8');
      console.log('Datos escritos correctamente');
  } catch (err) {
      console.error('Error al escribir el archivo', err);
      throw err;
  }
}
//get
app.get('/',(req,res) => {

res.send('Bienvenido a la app');

var tareas = obtenerTareas();
res.send(`Las tareas actuales son ${tareas} `)

});
//post crear
app.post ('/tareas', async (req, res) => {
//const tareaId = parseInt(req.params.id);
//let nuevaTarea = req.body
//se mantiene afuera para que lo reconozca el send 201
const {titulo, descripcion} = req.body;
try{

var tareas = await obtenerTareas();
//id--------
//const indice = Object.keys(tareas)
//var newindice = indice.length > 0 ? Math.max(...indice.map(Number))+1:1;
var newindice = tareas.length > 0 ? Math.max(...tareas.map(tarea => tarea.id)) + 1 : 1;
//-------
//Aqui se junta la variable de indice, para asignarla automaticamente
var tarea = { id: newindice, titulo, descripcion }; 
//se carga
tareas.push(tarea);
//Para reconocer que se envio
console.log(`Datos  ${JSON.stringify(tarea)}`);

await guardarTareas(tareas);}
  catch(error){
  console.error(`mostrando errror ${error}`)
  res.status(500).send('error en la solicitud');
}

res.status(201).send(`titulo de tarea: ${JSON.stringify(titulo)}`)
});

app.put ('/tareas/:id', async (req, res) => {/*
  const { titulo, descripcion } = req.body;
  var tareas = await obtenerTareas();
  var tarea = find (tarea => tarea.id === Number(id));*/

try{
  const tareaId = parseInt(req.params.id);
  
const datosNuevos = req.body;

const tareas = await obtenerTareas();
 //validando que el id exista
const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
//Cuando findindex no encuentra ninguna tarea con ese id retorna -1
console.log(tareaObjetivo,tareaId)
if (tareaObjetivo === -1){
  //404 porque no encontro ningun valor
  return res.status(404).send(`Tarea ${tareaId} no encontrada`);
}

tareas[tareaObjetivo] = {...tareas[tareaObjetivo], ...datosNuevos};

await guardarTareas(tareas);

res.json(tareas[tareaObjetivo]);}
catch (error){
  console.error(`mostrando errror ${error}`)
  res.status(500).send('Error en el proceso');
}
});



