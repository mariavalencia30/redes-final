// index.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const comprasController = require("./controllers/comprasController"); // Asegúrate de que la ruta sea correcta

// Crear la aplicación de Express
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Registrar las rutas del controlador de compras
app.use("/api/compras", comprasController); // Este es el punto clave para hacer las rutas accesibles

// Verifica con una ruta de prueba simple
app.get("/api/compras/test", (req, res) => {
    res.status(200).json({ message: "Ruta de prueba funcionando" });
});

// Iniciar el servidor
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Microservicio de Compras escuchando en el puerto ${PORT}`);
});
