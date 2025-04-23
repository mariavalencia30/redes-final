const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// Rutas de vehículos
// Rutas específicas primero
// Añadir esta línea antes de exportar el router

router.post('/vehiculos', vehiculosController.postVehiculo);
router.get('/vehiculos/marcas/:marca/modelos/:modelo/años', vehiculosController.getAñosPorMarcaYModelo);
router.get('/vehiculos/marcas/:marca/modelos', vehiculosController.getModelosPorMarca);
router.get('/vehiculos/marcas', vehiculosController.getMarcas);
router.post('/vehiculos/buscar', vehiculosController.buscarVehiculos);

router.put('/vehiculos/:id', vehiculosController.putVehiculo);
router.put('/vehiculos/:id/vendido', vehiculosController.marcarComoVendido);

// Rutas con parámetros después
router.get('/vehiculos/:id', vehiculosController.getVehiculoPorId);

// Rutas generales al final
router.get('/vehiculos', vehiculosController.getVehiculos);

router.delete('/vehiculos/:id', vehiculosController.deleteVehiculo);



module.exports = router; 