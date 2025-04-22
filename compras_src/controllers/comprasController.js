// comprasController.js

const express = require("express");
const router = express.Router();
const Compra = require("../models/comprasModel"); // Asegúrate de que el modelo esté bien importado

// Registrar una compra
router.post("/", async (req, res) => {
    const { userId, vehicleId, precioTotal, metodoPago, visitaId } = req.body;

    // Verificar si hay parámetros undefined
    if (!userId || !vehicleId || !precioTotal || !metodoPago || !visitaId) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    console.log("Datos recibidos para registrar la compra:", { userId, vehicleId, precioTotal, metodoPago, visitaId });

    try {
        // Registrar la compra
        const result = await Compra.registrarCompra(userId, vehicleId, precioTotal, metodoPago, visitaId);
        res.status(201).json({ message: "Compra registrada exitosamente", result });
    } catch (err) {
        // Aquí mejoramos el log del error
        console.error("Error completo al registrar la compra:", err);  // Log completo del error
        res.status(500).json({ message: "Error al registrar la compra", error: err.message, stack: err.stack });
    }
});


// Obtener las compras de un usuario
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const compras = await Compra.obtenerComprasPorUsuario(userId);
        res.status(200).json(compras);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el historial de compras", error: err });
    }
});

// Obtener las compras de un usuario
router.get("/all", async (req, res) => {
    try {
        const compras = await Compra.obtenerCompras();
        res.status(200).json(compras);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las compras", error: err });
    }
});

// Obtener una compra por ID
router.get("/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const compra = await Compra.obtenerCompraPorId(purchaseId);
        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }
        res.status(200).json(compra);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener la compra", error: err });
    }
});

// Actualizar una compra
router.put("/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    const { metodoPago, estado } = req.body;
    try {
        const result = await Compra.actualizarCompra(purchaseId, metodoPago, estado);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Compra actualizada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        if (err.message === "Compra no encontrada") {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === "Vehículo ya vendido") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error al actualizar la compra", error: err });
    }
});

// Eliminar una compra
router.delete("/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const result = await Compra.eliminarCompra(purchaseId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Compra eliminada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        if (err.message === "Compra no encontrada") {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === "Vehículo ya vendido") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error al eliminar la compra", error: err });
        
    }
});

// Registrar una venta de un vehículo
router.post("/venta/:purchaseId", async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const result = await Compra.registrarVenta(purchaseId);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Venta registrada exitosamente" });
        } else {
            res.status(404).json({ message: "Compra no encontrada" });
        }
    } catch (err) {
        if (err.message === "Compra no encontrada") {
            return res.status(404).json({ message: err.message });
        }
        if (err.message === "Vehículo ya vendido") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error al registrar la venta", error: err });
    }
});

// Registrar una visita de un comprador a un vehículo
router.post("/visitas", async (req, res) => {
    const { userId, vehicleId, asistio } = req.body;  // Recibimos el valor de 'asistio'
    
    try {
        // Ya no es necesario hacer validación externa, solo registramos la visita
        const result = await Compra.registrarVisita(userId, vehicleId, asistio);  // Pasamos 'asistio' aquí
        res.status(201).json({ message: "Visita registrada exitosamente", result });
    } catch (err) {
        if (err.message === "Usuario no encontrado" || err.message === "Vehículo no encontrado") {
            return res.status(400).json({ message: err.message });
        }
        if (err.message === "El vehículo ya ha sido vendido") {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error al registrar la visita", error: err });
    }
});

router.get("/visitasver", async (req, res) => {
    try {
        const visitas = await Compra.obtenerVisitas();
        res.status(200).json(visitas);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las visitas", error: err });
    }
});


// Ruta de prueba (para verificar que las rutas están funcionando)
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Ruta de prueba funcionando" });
});

module.exports = router;
