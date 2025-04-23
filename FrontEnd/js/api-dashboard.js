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
            // Asegurarse de que el usuario esté incluido en los datos
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                vehicleData.user_id = user.id;
            }
            
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(vehicleData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear vehículo');
            }
            
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

    // Agregar la función getUserVisits
    static async getUserVisits(userId) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/visitas/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener visitas del usuario:', error);
            throw error;
        }
    }
}

// Gestión de Compras
class PurchaseManager {
    static async createPurchase(purchaseData) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(purchaseData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear compra:', error);
            throw error;
        }
    }

    static async updatePurchase(id, purchaseData) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(purchaseData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar compra:', error);
            throw error;
        }
    }

    static async deletePurchase(id) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar compra:', error);
            throw error;
        }
    }

    static async completePurchase(id) {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/venta/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al completar compra:', error);
            throw error;
        }
    }
}

export {
    UserManager,
    VehicleManager,
    VisitManager,
    PurchaseManager,
    checkAuth
};