// Importar configuración
import { API_URLS } from './config.js';
app.use('/api', require('./routes/vehiculosRoutes'));

class Api {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    // Headers comunes para las peticiones
    get headers() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Método para manejar errores
    handleError(error) {
        console.error('API Error:', error);
        if (error.status === 401) {
            this.logout();
            window.location.href = '/';
        }
        throw error;
    }

    // Método genérico para hacer peticiones
    async fetchAPI(service, endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URLS[service]}${endpoint}`, {
                ...options,
                headers: this.headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la petición');
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
        }
    }

    // Registro de usuario
    async register(userData) {
        try {
            const response = await this.fetchAPI('usuarios', '/usuarios/register', {
                method: 'POST',
                body: JSON.stringify({
                    nombre: userData.nombre,
                    email: userData.email,
                    telefono: userData.telefono,
                    contrasena: userData.contrasena,
                    rol: userData.rol || 'user'
                })
            });

            return response;
        } catch (error) {
            throw new Error('Error en el registro: ' + error.message);
        }
    }

    // Inicio de sesión
    async login(email, password) {
        try {
            const response = await this.fetchAPI('usuarios', '/usuarios/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (response.token) {
                this.token = response.token;
                this.user = response.user;
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw new Error('Error en el inicio de sesión: ' + error.message);
        }
    }

    // Cerrar sesión
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Verificar estado de autenticación
    isAuthenticated() {
        return !!this.token;
    }

    // Obtener rol del usuario
    getUserRole() {
        return this.user?.rol || null;
    }

    // Obtener vehículos destacados
    async getFeaturedVehicles() {
        try {
            const response = await this.fetchAPI('vehiculos', '/vehiculos/destacados');
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener vehículos destacados:', error);
            return [];
        }
    }

    // Obtener todas las marcas únicas
    async getBrands() {
        try {
            const response = await this.fetchAPI('vehiculos', '/vehiculos/marcas');
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener marcas:', error);
            return [];
        }
    }

    // Obtener modelos por marca
    async getModelsByBrand(brand) {
        try {
            const response = await this.fetchAPI('vehiculos', `/vehiculos/marcas/${encodeURIComponent(brand)}/modelos`);
            return response.data || [];
        } catch (error) {
            console.error('Error al obtener modelos:', error);
            return [];
        }
    }

    // Buscar vehículos con filtros
    async searchVehicles(filters) {
        try {
            const response = await this.fetchAPI('vehiculos', '/vehiculos/buscar', {
                method: 'POST',
                body: JSON.stringify(filters)
            });
            return response.data || [];
        } catch (error) {
            console.error('Error al buscar vehículos:', error);
            return [];
        }
    }

    // Obtener un vehículo por ID
    async getVehicleById(id) {
        const response = await this.fetchAPI('vehiculos', `/vehiculos/${id}`);
        return response;
    }

    // Obtener perfil del usuario
    async getUserProfile() {
        return await this.fetchAPI('usuarios', '/usuarios/perfil');
    }

    // Actualizar perfil del usuario
    async updateUserProfile(profileData) {
        return await this.fetchAPI('usuarios', '/usuarios/perfil', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Cambiar contraseña
    async changePassword(currentPassword, newPassword) {
        return await this.fetchAPI('usuarios', '/usuarios/cambiar-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
    }

    // Eliminar cuenta
    async deleteAccount() {
        return await this.fetchAPI('usuarios', '/usuarios/cuenta', {
            method: 'DELETE'
        });
    }
}

// Exportar una instancia única de la API
export const api = new Api();