// vehiculosModel.js
const mysql = require("mysql2/promise");

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "base123456",
    database: "vehiculosbd",
    port: 3306,
});
// Agrega esto después de crear el pool de conexión:
connection.getConnection()
    .then(() => console.log("✅ Conexión a MySQL establecida"))
    .catch(err => {
        console.error("❌ Error de conexión a MySQL:", err.message);
        process.exit(1); // Termina el proceso con error
    });

// Clase Vehiculo
class Vehiculo {
    constructor(id, marca, modelo, año, precio, kilometraje) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.año = año;
        this.precio = precio;
        this.kilometraje = kilometraje;
        this.estado = "disponible";  // Estado por defecto
    }

    // Método para guardar un vehículo en la base de datos
    static async guardarVehiculo(vehiculo) {
        // Depuración adicional para verificar los valores antes de la validación
        console.log("Vehículo a guardar:", vehiculo);

        // Asegurarse de que los valores no sean undefined, null, o vacíos
        if (!vehiculo.marca || !vehiculo.modelo || !vehiculo.año || !vehiculo.precio || !vehiculo.kilometraje) {
            throw new Error("Faltan datos requeridos para crear el vehículo");
        }

        const [result] = await connection.execute(
            'INSERT INTO vehiculos (marca, modelo, año, precio, kilometraje, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [vehiculo.marca, vehiculo.modelo, vehiculo.año, vehiculo.precio, vehiculo.kilometraje, "disponible"]  // Estado por defecto 'disponible'
        );
        return result;
    }

    // Método para obtener todos los vehículos
    static async obtenerVehiculos(limit) {
        let query = 'SELECT * FROM vehiculos';
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        const [rows] = await connection.execute(query);
        return rows;
    }

    // Método para obtener un vehículo por id
    static async obtenerVehiculoPorId(id) {
        const [rows] = await connection.execute('SELECT * FROM vehiculos WHERE id = ?', [id]);
        return rows[0];
    }

    // Método para actualizar vehículo
    static async actualizarVehiculo(id, datos) {
        const [result] = await connection.execute(
            'UPDATE vehiculos SET marca = ?, modelo = ?, año = ?, precio = ?, kilometraje = ? WHERE id = ?',
            [datos.marca, datos.modelo, datos.año, datos.precio, datos.kilometraje, id]
        );
        return result;
    }

    // Método para eliminar vehículo
    static async eliminarVehiculo(id) {
        const [result] = await connection.execute('DELETE FROM vehiculos WHERE id = ?', [id]);
        return result;
    }

    // Método para marcar como vendido
    static async marcarComoVendido(id) {
        const [result] = await connection.execute('UPDATE vehiculos SET estado = ? WHERE id = ?', ['vendido', id]);
        return result;
    }

    // Método para buscar vehículos por nombre (marca o modelo)
    static async buscarVehiculos(filtros = {}) {
        // Validación básica
        if (!filtros || typeof filtros !== 'object') {
            console.warn("[Modelo] Filtros inválidos");
            return [];
        }

        console.log("[Modelo] Filtros recibidos:", filtros);

        try {
            let query = `SELECT * FROM vehiculos WHERE 1=1`;
            const valores = [];

            // Filtros existentes (marca, modelo, año)
            if (filtros.marca) {
                query += ` AND marca = ?`;
                valores.push(filtros.marca.trim());
            }
            if (filtros.modelo) {
                query += ` AND modelo = ?`;
                valores.push(filtros.modelo.trim());
            }
            if (filtros.año) {
                query += ` AND año = ?`;
                valores.push(parseInt(filtros.año));
            }

            // Filtros: estado y precio
            if (filtros.estado) {
                query += ` AND estado = ?`;
                valores.push(filtros.estado.trim());
            }
            if (filtros.precio_max) {
                query += ` AND precio <= ?`;
                valores.push(parseFloat(filtros.precio_max));
            }
            if (filtros.precio_min) {
                query += ` AND precio >= ?`;
                valores.push(parseFloat(filtros.precio_min));
            }

            console.log("[Modelo] Consulta SQL:", query);
            console.log("[Modelo] Valores:", valores);

            const [rows] = await connection.execute(query, valores);
            console.log(`[Modelo] ${rows.length} resultados encontrados`);

            return rows;

        } catch (err) {
            console.error("[Modelo] Error en búsqueda:", err.message);
            throw new Error("Error al filtrar vehículos");
        }
    }

    // Método para obtener todas las marcas únicas
    static async obtenerMarcas() {
        try {
            console.log('Iniciando consulta de marcas');
            const [rows] = await connection.execute(
                'SELECT DISTINCT marca FROM vehiculos ORDER BY marca'
            );
            const marcas = rows.map(row => row.marca);
            console.log('Marcas encontradas:', marcas);
            return marcas;
        } catch (err) {
            console.error('Error en obtenerMarcas:', err);
            throw err;
        }
    }

    // Método para obtener vehículos destacados (los 3 primeros disponibles)
    static async obtenerVehiculosDestacados() {
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM vehiculos WHERE estado = "disponible" LIMIT 3'
            );
            return rows;
        } catch (error) {
            console.error('Error al obtener vehículos destacados:', error);
            throw new Error('Error al obtener los vehículos destacados');
        }
    }

    // Método para obtener modelos por marca
    static async obtenerModelosPorMarca(marca) {
        try {
            const [rows] = await connection.execute(
                'SELECT DISTINCT modelo FROM vehiculos WHERE marca = ? ORDER BY modelo',
                [marca]
            );
            return rows.map(row => row.modelo);
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            throw new Error('Error al obtener los modelos de vehículos');
        }
    }

    // Método para obtener años por marca y modelo
    static async obtenerAñosPorMarcaYModelo(marca, modelo) {
        try {
            const [rows] = await connection.execute(
                'SELECT DISTINCT año FROM vehiculos WHERE marca = ? AND modelo = ? ORDER BY año DESC',
                [marca, modelo]
            );
            return rows.map(row => row.año);
        } catch (error) {
            console.error('Error al obtener años:', error);
            throw new Error('Error al obtener los años de vehículos');
        }
    }
}
module.exports = Vehiculo;