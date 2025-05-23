const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const vehiculosRoutes = require('./routes/vehiculosRoutes');

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Configuración correcta de CORS
const allowedOrigins = [
    'http://salecars.co',        // Tu dominio principal
    'https://salecars.co',       // Si usas HTTPS en el futuro
    'http://www.salecars.co',
    'https://www.salecars.co',
    'http://localhost',          // Para desarrollo local
    'http://localhost:80',       // Acceso local a través del puerto 80 (HAProxy)
    'http://192.168.119.138',    // La IP de tu servidor Ubuntu (acceso directo a HAProxy)
    'http://192.168.119.138:80', // La IP de tu servidor Ubuntu con puerto 80
    // *** MUY IMPORTANTE: TEMPORALMENTE añade los orígenes con puerto 3002/8082 ***
    // Esto es un parche mientras NO arregles el frontend para que apunte solo a HAProxy (puerto 80).
    // Una vez que el frontend esté corregido, ESTAS DOS LÍNEAS DE ABAJO DEBERÍAN ELIMINARSE.
    'http://salecars.co:3002', // Si el frontend está erróneamente llamando a este puerto
    'http://192.168.119.138:3002', // Si el frontend está erróneamente llamando a esta IP:puerto
    'http://localhost:3000', // Si tu entorno de desarrollo del frontend usa este puerto
    'http://localhost:8082', // Si tu frontend (salescarsv2_frontend) es alcanzado directamente por el puerto 8082
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (ej. Postman, o peticiones de archivos locales)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log el origen no permitido para depuración
            console.error(`CORS: Origen no permitido: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Asegúrate de que PUT y POST estén aquí
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Añade cualquier encabezado personalizado que envíes
    credentials: true
}));

// Rutas
app.use('/api', vehiculosRoutes);

// Ruta de prueba
app.get("/test", (req, res) => {
    res.status(200).json({ message: "Servidor de vehículos funcionando correctamente" });
});

// Iniciar el servidor escuchando en 0.0.0.0
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de vehículos corriendo en 0.0.0.0:${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- GET  /api/vehiculos');
    console.log('- GET  /api/vehiculos/:id');
    console.log('- POST /api/vehiculos/buscar');
    console.log('- GET  /api/vehiculos/marcas');
    console.log('- GET  /api/vehiculos/marcas/:marca/modelos');
    console.log('- GET  /api/vehiculos/marcas/:marca/modelos/:modelo/years');
});
