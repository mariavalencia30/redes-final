// usuariosController.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuariosModel");  // Solo importa la clase Usuario

// Registrar un usuario
router.post("/api/usuarios/register", async (req, res) => {
    const { email, nombre, telefono, contrasena, rol } = req.body;

    try {
        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.obtenerUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Registrar usuario sin encriptar la contraseña
        const result = await Usuario.registrarUsuario(email, nombre, telefono, contrasena, rol);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).json({ message: "Error al registrar usuario", error: err.message });
    }
});

// Ruta de login
router.post('/api/usuarios/login', async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        // Verificar las credenciales usando el método de la clase Usuario
        const usuario = await Usuario.obtenerUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Imprimir las contraseñas para depuración
        console.log(`Contraseña ingresada: '${contrasena}'`);
        console.log(`Contraseña almacenada en la base de datos: '${usuario.contrasena}'`);

        // Comparar las contraseñas (en texto plano)
        if (usuario.contrasena.trim() !== contrasena.trim()) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        return res.status(200).json({
            message: "Login exitoso",
            id: usuario.id,
            nombre: usuario.nombre,            
            role: usuario.rol || 'user',
            redirect: usuario.rol === 'admin' ? '/admin' : '/perfil'
        });
        
    } catch (err) {
        console.log('Error en la base de datos:', err);
        return res.status(500).json({ message: "Error en la base de datos", error: err });
    }
});

// Cambiar contraseña (ruta específica)
router.put('/api/usuarios/password-change', async (req, res) => {
    const { id, nuevaContrasena } = req.body;
    
    
    try {
        const result = await Usuario.actualizarContrasena(id, nuevaContrasena);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ 
                success: true,
                message: "Contraseña actualizada exitosamente" 
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: "Usuario no encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al cambiar contraseña",
            error: error.message
        });
    }
});


// Obtener información del usuario
router.get("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuario", error: err });
    }
});

// Ruta PUT para actualizar un usuario
router.put("/api/usuarios/:id", async (req, res) => {
    console.log("Datos recibidos para actualización:", req.body);
    const { id } = req.params;
    const { email, nombre, telefono, rol } = req.body;

    try {
        // Llamamos al método actualizarUsuario del modelo con los campos correctos
        const result = await Usuario.actualizarUsuario(id, email, nombre, telefono, rol);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Datos actualizados exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error("Error en la actualización de datos:", err);
        res.status(500).json({ message: "Error al actualizar datos", error: err.message });
    }
});
// Eliminar cuenta de usuario
router.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Usuario.eliminarUsuario(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar cuenta", error: err });
    }
});

// Recuperación de contraseña (forgot-password)
router.post("/api/usuarios/forgot-password", async (req, res) => {
    // Lógica de recuperación de contraseña (podría ser mediante correo electrónico)
    res.status(200).json({ message: "Proceso de recuperación de contraseña iniciado" });
});

// Cerrar sesión
router.post("/api/usuarios/logout", (req, res) => {
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
});



// Obtener todos los usuarios
router.get("/api/usuarios", async (req, res) => {
    try {
        // Usar el método obtenerTodosUsuarios de la clase Usuario
        const usuarios = await Usuario.obtenerTodosUsuarios();
        res.status(200).json(usuarios);  // Devolver la lista de usuarios
    } catch (err) {
        console.log('Error al obtener usuarios:', err);
        res.status(500).json({ message: "Error al obtener los usuarios", error: err });
    }
});


module.exports = router;