// index.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const usuariosController = require("./controllers/usuariosController");

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON
app.use(cors()); // Habilitar CORS

// Registrar rutas del controlador de usuarios
app.use(usuariosController);

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Microservicio de usuarios escuchando en el puerto ${PORT}`);
});