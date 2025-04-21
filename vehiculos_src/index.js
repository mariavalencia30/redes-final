const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const vehiculosController = require("./controllers/vehiculosController"); // Importar el controlador

const app = express();

app.use(morgan("dev"));
app.use(express.json());  // Asegúrate de que el servidor pueda leer JSON
app.use(cors());  // Habilitar CORS

// Registrar las rutas del controlador de vehículos
app.get("/api/vehiculos/buscar", vehiculosController.buscarVehiculos); // Ruta para buscar vehículos (GET)
app.post("/api/vehiculos", vehiculosController.postVehiculo);  // Ruta para crear un vehículo (POST)
app.get("/api/vehiculos", vehiculosController.getVehiculos);   // Ruta para obtener todos los vehículos (GET)
app.get("/api/vehiculos/:id", vehiculosController.getVehiculoPorId);  // Ruta para obtener un vehículo por ID (GET)
app.put("/api/vehiculos/:id", vehiculosController.putVehiculo); // Ruta para actualizar un vehículo por ID (PUT)
app.delete("/api/vehiculos/:id", vehiculosController.deleteVehiculo); // Ruta para eliminar un vehículo por ID (DELETE)
app.put("/api/vehiculos/:id/marcar-como-vendido", vehiculosController.marcarComoVendido); //Ruta para marcar como vendido (PUT) 

// Verifica que la ruta de prueba funcione
app.get("/api/vehiculos/test", (req, res) => {
    res.status(200).json({ message: "Ruta de prueba funcionando" });
});

// Inicia el servidor en el puerto 3002
const PORT = 3002;  // Cambié el puerto a 3002
app.listen(PORT, () => {
    console.log(`Microservicio de Vehículos escuchando en el puerto ${PORT}`);
});
