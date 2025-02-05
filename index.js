// Servidor
const app = express();
app.set('port', 3000);
app.listen(app.get('port'), () => {
    console.log("Servidor corriendo en puerto", app.get('port'));
});

// Configuración
app.use(express.static(path.join(__dirname, "src")));  
app.use(express.json());
