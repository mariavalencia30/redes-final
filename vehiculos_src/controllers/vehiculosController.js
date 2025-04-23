const express = require("express");
const router = express.Router();
const Vehiculo = require("../models/vehiculosModel");

// Crear vehículo
const postVehiculo = async (req, res) => {
    let { marca, modelo, año, precio, kilometraje } = req.body;

    // Limpiar los campos para asegurarnos de que no tengan espacios extra
    marca = marca ? marca.trim() : "";
    modelo = modelo ? modelo.trim() : "";
    año = año ? año.toString().trim() : "";
    precio = precio ? precio.toString().trim() : "";
    kilometraje = kilometraje ? kilometraje.toString().trim() : "";

    console.log("Datos recibidos:", req.body);  // Registra el cuerpo de la solicitud
    console.log("Campos limpios:", { marca, modelo, año, precio, kilometraje }); // Verifica los valores limpios

    // Validación: Asegurarse de que todos los campos están presentes
    if (!marca || !modelo || !año || !precio || !kilometraje) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Crear el objeto Vehiculo sin el 'id' (porque es auto-incrementado)
    const nuevoVehiculo = {
        marca: marca,
        modelo: modelo,
        año: año,
        precio: precio,
        kilometraje: kilometraje,
        estado: "disponible"
    };

    console.log("Vehículo a guardar:", nuevoVehiculo); // Verifica la estructura del objeto

    try {
        // Guardar el vehículo en la base de datos
        const result = await Vehiculo.guardarVehiculo(nuevoVehiculo);
        res.status(201).json(nuevoVehiculo); // Responder con el vehículo creado
    } catch (err) {
        console.error("Error al crear vehículo:", err);  // Mostrar el error completo en los logs para diagnóstico
        res.status(500).json({ message: "Error al crear vehículo", error: err });
    }
};

// Obtener todos los vehículos
const getVehiculos = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const vehiculos = await Vehiculo.obtenerVehiculos(limit);
        res.status(200).json({
            success: true,
            count: vehiculos.length,
            data: vehiculos
        });
    } catch (err) {
        console.error('Error al obtener vehículos:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener vehículos",
            error: err.message
        });
    }
};

// Obtener vehículo por ID
const getVehiculoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.obtenerVehiculoPorId(id);
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: "Vehículo no encontrado"
            });
        }
        res.status(200).json({
            success: true,
            data: vehiculo
        });
    } catch (err) {
        console.error('Error al obtener vehículo por ID:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener el vehículo",
            error: err.message
        });
    }
};

// Actualizar vehículo
const putVehiculo = async (req, res) => {
    const { id } = req.params;
    const { marca, modelo, año, precio, kilometraje } = req.body;
    try {
        const result = await Vehiculo.actualizarVehiculo(id, { marca, modelo, año, precio, kilometraje });
        res.status(200).json({ message: "Vehículo actualizado exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el vehículo", error: err });
    }
};

// Eliminar vehículo
const deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.eliminarVehiculo(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ 
                success: true,
                message: "Vehículo eliminado exitosamente" 
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: "Vehículo no encontrado" 
            });
        }
    } catch (err) {
        console.error('Error al eliminar vehículo:', err);
        res.status(500).json({ 
            success: false,
            message: "Error al eliminar vehículo", 
            error: err.message 
        });
    }
};


// En controllers/vehiculosController.js
const marcarComoVendido = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.marcarComoVendido(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json({ 
            success: true,
            message: "Estado actualizado a vendido" 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el estado",
            error: error.message
        });
    }
};

// Buscar vehículos con filtros
const buscarVehiculos = async (req, res) => {
    try {
        const { marca, modelo, año, precio_min, precio_max } = req.body;
        
        console.log('Filtros recibidos:', req.body);

        const vehiculos = await Vehiculo.buscarVehiculos({
            marca,
            modelo,
            año,
            precio_min,
            precio_max
        });

        res.status(200).json({
            success: true,
            count: vehiculos.length,
            data: vehiculos
        });

    } catch (err) {
        console.error('Error en búsqueda de vehículos:', err);
        res.status(500).json({
            success: false,
            message: "Error al buscar vehículos",
            error: err.message
        });
    }
};

// Obtener marcas únicas
const getMarcas = async (req, res) => {
    try {
        console.log('Solicitud recibida para obtener marcas');
        const marcas = await Vehiculo.obtenerMarcas();
        console.log('Marcas obtenidas:', marcas);
        
        if (!marcas || marcas.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: marcas.length,
            data: marcas
        });
    } catch (err) {
        console.error('Error al obtener marcas:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener marcas",
            error: err.message
        });
    }
};

// Obtener vehículos destacados
const getVehiculosDestacados = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.obtenerVehiculosDestacados();
        res.status(200).json({
            success: true,
            count: vehiculos.length,
            data: vehiculos
        });
    } catch (err) {
        console.error('Error al obtener vehículos destacados:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener vehículos destacados",
            error: err.message
        });
    }
};

// Obtener modelos por marca
const getModelosPorMarca = async (req, res) => {
    const { marca } = req.params;
    try {
        const modelos = await Vehiculo.obtenerModelosPorMarca(marca);
        res.status(200).json({
            success: true,
            count: modelos.length,
            data: modelos
        });
    } catch (err) {
        console.error('Error al obtener modelos:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener modelos",
            error: err.message
        });
    }
};

// Obtener años por marca y modelo
const getAñosPorMarcaYModelo = async (req, res) => {
    const { marca, modelo } = req.params;
    try {
        const años = await Vehiculo.obtenerAñosPorMarcaYModelo(marca, modelo);
        res.status(200).json({
            success: true,
            count: años.length,
            data: años
        });
    } catch (err) {
        console.error('Error al obtener años:', err);
        res.status(500).json({
            success: false,
            message: "Error al obtener años",
            error: err.message
        });
    }
};

// Exportar las funciones
module.exports = {
    postVehiculo,
    getVehiculos,
    getVehiculoPorId,
    putVehiculo,
    deleteVehiculo,
    marcarComoVendido,
    buscarVehiculos,
    getMarcas,
    getVehiculosDestacados,
    getModelosPorMarca,
    getAñosPorMarcaYModelo
};