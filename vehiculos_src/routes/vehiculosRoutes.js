const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// Rutas de vehículos
// Rutas específicas primero
router.get('/vehiculos/marcas/:marca/modelos/:modelo/años', vehiculosController.getAñosPorMarcaYModelo);
router.get('/vehiculos/marcas/:marca/modelos', vehiculosController.getModelosPorMarca);
router.get('/vehiculos/marcas', vehiculosController.getMarcas);
router.post('/vehiculos/buscar', vehiculosController.buscarVehiculos);

// Rutas con parámetros después
router.get('/vehiculos/:id', vehiculosController.getVehiculoPorId);

// Rutas generales al final
router.get('/vehiculos', vehiculosController.getVehiculos);

module.exports = router; 