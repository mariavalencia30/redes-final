// comprasModel.js

const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

// Configuración de la conexión a la base de datos MySQL
// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "base123456",
    database: "comprasbd", // Base de datos para registrar compras
    port: 3306,
});

// URL de los microservicios
const URLUSERS = "http://localhost:3001";
const URLCARS = "http://localhost:3002";

class Compra {
    
    // Método para registrar una compra
    static async registrarCompra(userId, vehicleId, precioTotal, metodoPago, visitaId) {
        console.log("Registrando compra con los siguientes datos:", { userId, vehicleId, precioTotal, metodoPago, visitaId });

        // Validar los parámetros antes de realizar la consulta
        if (userId === undefined || vehicleId === undefined || precioTotal === undefined || metodoPago === undefined) {
            throw new Error("Todos los campos son obligatorios y no deben ser undefined.");
        }

        const fecha = new Date();  // Fecha actual

        // Si alguno de los valores es 'undefined', se pasa como 'null'
        const finalUserId = userId || null;
        const finalVehicleId = vehicleId || null;
        const finalPrecioTotal = precioTotal || null;
        const finalMetodoPago = metodoPago || null;

        try {
            // Verificación con microservicios (usuario y vehículo)
            const userResponse = await fetch(`${URLUSERS}/api/usuarios/${userId}`);
            const userData = await userResponse.json();
            if (!userData) {
                throw new Error("Usuario no encontrado");
            }

            const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${vehicleId}`);
            const vehicleData = await vehicleResponse.json();
            if (!vehicleData) {
                throw new Error("Vehículo no encontrado");
            }

            // Verificar si el vehículo ya está vendido
            if (vehicleData.estado === "vendido") {
                throw new Error("El vehículo ya ha sido vendido");
            }

            // Registrar la compra
            const [result] = await connection.execute(
                'INSERT INTO compras (user_id, vehicle_id, fecha, precio_total, metodo_pago, estado, visita_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [finalUserId, finalVehicleId, fecha, finalPrecioTotal, finalMetodoPago, "pendiente", visitaId]
            );

            console.log("Compra registrada exitosamente:", result);
            return result;
        } catch (err) {
            // Registrar el error completo
            console.error("Error completo al registrar la compra en la base de datos:", err);
            throw new Error("Error al registrar la compra");
        }
    }


    // Método para obtener las compras de un usuario
    static async obtenerComprasPorUsuario(userId) {
        const [rows] = await connection.execute('SELECT * FROM compras WHERE user_id = ?', [userId]);
        return rows;
    }

    static async obtenerCompras(limit) {
        let query = 'SELECT * FROM compras';
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        const [rows] = await connection.execute(query);
        return rows;
    }

    static async obtenerVisitas(limit) {
        let query = 'SELECT * FROM visitas';
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        const [rows] = await connection.execute(query);
        return rows;
    }

    // Método para obtener una compra por ID
    static async obtenerCompraPorId(purchaseId) {
        const [rows] = await connection.execute('SELECT * FROM compras WHERE id = ?', [purchaseId]);
        return rows[0];
    }

    // Método para actualizar una compra
    static async actualizarCompra(purchaseId, metodoPago, estado) {
        // validaciones de los datos
        if (!metodoPago || !estado) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
       
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${purchase.vehicle_id}`);
        const vehicleData = await vehicleResponse.json();
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }

        const [result] = await connection.execute(
            'UPDATE compras SET metodo_pago = ?, estado = ? WHERE id = ?',
            [metodoPago, estado, purchaseId]
        );
        return result;
    }

    // Método para eliminar una compra
    static async eliminarCompra(purchaseId) {
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${purchase.vehicle_id}`);
        const vehicleData = await vehicleResponse.json();
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }
        const [result] = await connection.execute('DELETE FROM compras WHERE id = ?', [purchaseId]);
        return result;
    }

    // Método para marcar una compra como "venta realizada"
    static async registrarVenta(purchaseId) {
        // Aquí podrías agregar lógica para verificar si la compra existe
        const purchase = await this.obtenerCompraPorId(purchaseId);
        if (!purchase) {
            throw new Error("Compra no encontrada");
        }
        const [result] = await connection.execute(
            'UPDATE compras SET estado = "venta realizada" WHERE id = ?',
            [purchaseId]
        );
        return result;
    }

    // Método para registrar una visita de un posible comprador a un vehículo
    static async registrarVisita(userId, vehicleId, asistio) {
        // validaciones de los datos
        if (!userId || !vehicleId) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Aquí podrías agregar lógica para verificar si el usuario y el vehículo existen
        const userResponse = await fetch(`${URLUSERS}/api/usuarios/${userId}`);
        const userData = await userResponse.json();
        if (!userData) {
            throw new Error("Usuario no encontrado");
        }
        const vehicleResponse = await fetch(`${URLCARS}/api/vehiculos/${vehicleId}`);
        const vehicleData = await vehicleResponse.json();
        if (!vehicleData) {
            throw new Error("Vehículo no encontrado");
        }
        // Aquí podrías agregar lógica para verificar si el vehículo ya está vendido
        if (vehicleData.estado === "vendido") {
            throw new Error("El vehículo ya ha sido vendido");
        }
        const fecha = new Date();
        const [result] = await connection.execute(
            'INSERT INTO visitas (user_id, vehicle_id, fecha, asistio) VALUES (?, ?, ?, ?)',
            [userId, vehicleId, fecha, asistio]
        );
        return result;
    }

}

module.exports = Compra;
