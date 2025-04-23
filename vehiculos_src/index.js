const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const vehiculosRoutes = require('./routes/vehiculosRoutes');

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Configuración mejorada de CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000', 'http://localhost:8001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Rutas
app.use('/api', vehiculosRoutes);

// Verifica que la ruta de prueba funcione
app.get("/test", (req, res) => {
    res.status(200).json({ message: "Servidor de vehículos funcionando correctamente" });
});

// Inicia el servidor en el puerto 3002
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor de vehículos corriendo en el puerto ${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- GET  /api/vehiculos');
    console.log('- GET  /api/vehiculos/:id');
    console.log('- POST /api/vehiculos/buscar');
    console.log('- GET  /api/vehiculos/marcas');
    console.log('- GET  /api/vehiculos/marcas/:marca/modelos');
    console.log('- GET  /api/vehiculos/marcas/:marca/modelos/:modelo/años');
});