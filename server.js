const express = require('express');

const { findSourceMap } = require('module');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const  app = express();
const PORT = 3000;
const SECRET_KEY = 'tecmilenio';


app.use(express.json());
app.use(bodyParser.json());





app.listen(PORT, () => {
  console.log(`servidor corriendo en: http://localhost:${PORT}`);
});


// Middleware 
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Token inválido.' });
      }

      req.user = user;
      next();
  });
};

//  registro
app.post('/register', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
      return res.status(400).json({ message: 'Falta usuario o contraseña' });
  }

  try {
      const data = await fs.readFile('users.json', 'utf8');
      const users = JSON.parse(data);

      // Verificar si el usuario ya existe
      if (users.find(user => user.usuario === usuario)) {
          return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Agregar nuevo usuario al arreglo
      users.push({ usuario, password: hashedPassword });

      await fs.writeFile('users.json', JSON.stringify(users));

      console.log('Usuario registrado:', usuario); 

      res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ message: 'Error del servidor' });
  }
});

// login
app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
      return res.status(400).json({ message: 'Falta usuario o contraseña' });
  }

  try {
      const data = await fs.readFile('users.json', 'utf8');
      const users = JSON.parse(data);

      // Buscar el usuario en el arreglo
      const user = users.find(user => user.usuario === usuario);

      if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }

      const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login exitoso', token });
  } catch (err) {
      console.error('Error al hacer login:', err);
      res.status(500).json({ message: 'Error del servidor' });
  }
});

/*
app.get('/tareas', autenticarToken, (req, res) => {

});*/


async function obtenerTareas() {
  try {
      const data = await fs.readFile('tareas.json', 'utf8');
      return JSON.parse(data);
  } catch (err) {
      console.error('Error al leer el archivo', err);
      throw err;
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
app.get('/', authenticateToken,async (req, res) => {
  try {
    //imprime las tareas en formato texto
    const tareas = await obtenerTareas();
    res.send(`Bienvenido a la app Las tareas actuales son: ${JSON.stringify(tareas)}`);
  } catch (err) {
    res.status(500).send('Error al obtener las tareas');
    console.log(err)
  }
});
//post crear
app.post ('/tareas', authenticateToken,async (req, res) => {
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
  catch(err){
  console.error(`mostrando errror ${err}`)
  res.status(500).send('error en la solicitud');
}

res.status(201).send(`titulo de tarea: ${JSON.stringify(titulo)}`)
});
//put
app.put ('/tareas/:id', authenticateToken,async (req, res) => {/*
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
catch (err){
  console.error(`mostrando errror ${err}`)
  res.status(500).send('Error en el proceso');
}
});
//eliminar
app.delete ('/tareas/:id',authenticateToken,async (req,res) =>{
 /* const { titulo, descripcion } = req.body;
  var tareas = await obtenerTareas();
  var tarea = find (tarea => tarea.id === Number(id));*/

try{
  const tareaId = parseInt(req.params.id);
  
//const datosNuevos = req.body;

const tareas = await obtenerTareas();
 //validando que el id exista
const tareaObjetivo = tareas.findIndex((tareita) => tareita.id === tareaId);
//Cuando findindex no encuentra ninguna tarea con ese id retorna -1
console.log(tareaObjetivo,tareaId)
if (tareaObjetivo === -1){
  //404 porque no encontro ningun valor
  console.log(`tarea con id ${tareaId} no encontrada `)
  return res.status(404).send(`Tarea ${tareaId} no encontrada`);
  
}
//eliminando

//elimina solo 1
const tareaEliminada = tareas.splice(tareaObjetivo, 1);
await guardarTareas
//tareas.delete(tareaObjetivo)


//tareas[tareaObjetivo] = {...tareas[tareaObjetivo], ...datosNuevos};

await guardarTareas(tareas);


res.json(tareaEliminada[0]);
res.json(tareas[tareaObjetivo]);}
catch (err){
  console.error(`mostrando errror ${err}`)
  res.status(500).send('Error en el proceso');
}
});




