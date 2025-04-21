import { API_URLS } from './config.js';

// Verificación de autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/index.html';
    }
};

// Gestión de Usuario
class UserManager {
    static async updateProfile(userData) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    }

    // Función para cambiar contraseña
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/password-change`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: userId,
                    currentPassword,
                    newPassword
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    }

    // Función para recuperar contraseña
    static async recoverPassword(email) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await response.json();
        } catch (error) {
            console.error('Error al recuperar contraseña:', error);
            throw error;
        }
    }

    // Función para cerrar sesión en el servidor
    static async logoutServer() {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/logout`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al cerrar sesión en servidor:', error);
            throw error;
        }
    }

    static async deleteAccount(userId) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            throw error;
        }
    }
}

// Gestión de Vehículos
class VehicleManager {
    static async createVehicle(vehicleData) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            throw error;
        }
    }

    static async updateVehicle(id, vehicleData) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            throw error;
        }
    }

    static async deleteVehicle(id) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    }

    static async markAsSold(id) {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}/vendido`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al marcar vehículo como vendido:', error);
            throw error;
        }
    }
}

// Gestión de Visitas
class VisitManager {
    static async createVisit(visitData) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/visitas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(visitData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear visita:', error);
            throw error;
        }
    }

   
}

export {
    UserManager,
    VehicleManager,
    VisitManager,
    checkAuth
};