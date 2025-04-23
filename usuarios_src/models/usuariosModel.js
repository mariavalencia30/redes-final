const mysql = require("mysql2/promise");

// Configuración mejorada de conexión
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "base123456",
    database: "usuariosbd",
    port: 3306,
    charset: 'utf8mb4' // Añadido para soportar caracteres especiales
});

// Función mejorada para probar conexión
async function testConnection() {
    try {
        const conn = await connection.getConnection();
        console.log('✅ Conexión exitosa a MariaDB');
        
        // Verificar estructura de la tabla usuarios
        const [columns] = await conn.query('DESCRIBE usuarios');
        console.log('🔍 Estructura de la tabla usuarios:', columns);
        
        conn.release();
    } catch (error) {
        console.error('❌ Error crítico de conexión:', error);
        process.exit(1); // Salir si no hay conexión
    }
}

testConnection();

class Usuario {
    constructor(id, email, nombre, telefono, contrasena) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contrasena = contrasena;
    }

    // Método mejorado para registrar usuario
    static async registrarUsuario(email, nombre, telefono, contrasena, rol = 'user') {
        try {
            // Validación básica
            if (!email || !contrasena) throw new Error('Email y contraseña son requeridos');
            
            const [result] = await connection.execute(
                'INSERT INTO usuarios (email, nombre, telefono, contrasena, rol) VALUES (?, ?, ?, ?, ?)',
                [email.trim(), nombre?.trim(), telefono?.trim(), contrasena.trim(), rol]
            );
            return result;
        } catch (error) {
            console.error('Error en registrarUsuario:', error);
            throw error;
        }
    }

    // Método mejorado para obtener usuario por email
    static async obtenerUsuarioPorEmail(email) {
        try {
            if (!email) throw new Error('Email es requerido');
            
            const [rows] = await connection.execute(
                'SELECT id, email, nombre, telefono, contrasena, rol FROM usuarios WHERE email = ? LIMIT 1', 
                [email.trim()]
            );
            
            if (!rows.length) {
                console.log('⚠️ Usuario no encontrado para email:', email);
                return null;
            }
            
            console.log('Usuario encontrado:', {
                id: rows[0].id,
                email: rows[0].email,
                contrasenaLength: rows[0].contrasena?.length
            });
            
            return rows[0];
        } catch (error) {
            console.error('Error crítico en obtenerUsuarioPorEmail:', {
                error: error.message,
                email
            });
            throw error;
        }
    }

    static async actualizarContrasena(id, nuevaContrasena) {
        try {
            const [result] = await connection.execute(
                'UPDATE usuarios SET contrasena = ? WHERE id = ?',
                [nuevaContrasena, id]
            );
            return result;
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw new Error('Error en la base de datos');
        }
    }

    // Método para obtener un usuario por id
    static async obtenerUsuarioPorId(id) {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

// Método para actualizar un usuario 
static async actualizarUsuario(id, email, nombre, telefono, rol) {
    try {
        // Preparamos la consulta SQL para actualizar solo los campos que se proporcionan
        let query = 'UPDATE usuarios SET ';
        const params = [];
        const updateFields = [];
        
        if (email !== null && email !== undefined) {
            updateFields.push('email = ?');
            params.push(email);
        }
        
        if (nombre !== null && nombre !== undefined) {
            updateFields.push('nombre = ?');
            params.push(nombre);
        }
        
        if (telefono !== null && telefono !== undefined) {
            updateFields.push('telefono = ?');
            params.push(telefono);
        }
        
        if (rol !== null && rol !== undefined) {
            updateFields.push('rol = ?');
            params.push(rol);
        }
        
        // Si no hay campos para actualizar, lanzamos un error
        if (updateFields.length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }
        
        // Completamos la consulta
        query += updateFields.join(', ') + ' WHERE id = ?';
        params.push(id);
        
        // Ejecutamos la consulta
        const [result] = await connection.execute(query, params);
        return result;
    } catch (error) {
        console.error('Error en actualizarUsuario:', error);
        throw error;
    }
}

    // Método para eliminar usuario por id
    static async eliminarUsuario(id) {
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
}

    // Método para obtener todos los usuarios
    static async obtenerTodosUsuarios() {
    const [rows] = await connection.execute('SELECT * FROM usuarios');
    return rows;  // Retorna todos los usuarios
}


    
}

module.exports = Usuario;