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
        const vehiculos = await Vehiculo.obtenerVehiculos();
        res.status(200).json(vehiculos);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener vehículos", error: err });
    }
};

// Obtener vehículo por ID
const getVehiculoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const vehiculo = await Vehiculo.obtenerVehiculoPorId(id);
        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json(vehiculo);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el vehículo", error: err });
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
        res.status(200).json({ message: "Vehículo eliminado exitosamente", result });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el vehículo", error: err });
    }
};

// Marcar vehículo como vendido
const marcarComoVendido = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Vehiculo.marcarComoVendido(id);
        res.status(200).json({ message: "Vehículo marcado como vendido", result });
    } catch (err) {
        res.status(500).json({ message: "Error al marcar el vehículo como vendido", error: err });
    }
};

// Buscar vehículos por marca, modelo o año
const buscarVehiculos = async (req, res) => {
    // Extrae TODOS los posibles filtros
    const { marca, modelo, año, estado, precio_min, precio_max } = req.query;

    try {
        const vehiculos = await Vehiculo.buscarVehiculos({
            marca,
            modelo,
            año,
            estado,       // Nuevo filtro
            precio_min,    // Nuevo filtro
            precio_max     // Nuevo filtro
        });

        res.status(200).json({
            success: true,
            count: vehiculos.length,
            data: vehiculos
        });

    } catch (err) {
        res.status(500).json({
            success: false,
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
    buscarVehiculos
};