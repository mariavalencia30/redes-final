import { API_URLS } from './config.js';

document.getElementById('logoutBtn').addEventListener('click', () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Redireccionar a la página de login (ajusta la ruta según tu estructura)
    window.location.href = '../index.html'; 
});


// Verificación de autenticación
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'admin') {
        window.location.href = '/index.html';
    }
};

// Ejecutar verificación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuth);

// Gestión de Usuarios
class UserManager {
    static async getAllUsers() {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            // Validación mejorada
            const errors = [];
            if (!userData.password) errors.push("La contraseña es requerida");
            if (!userData.email) errors.push("El email es requerido");
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) errors.push("Email inválido");
            if (userData.password.length < 6) errors.push("La contraseña debe tener al menos 6 caracteres");
            
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }
    
            // Reestructurar los datos exactamente como el backend los espera
            const requestData = {
                nombre: userData.nombre || userData.name,
                email: userData.email,
                telefono: userData.telefono || userData.phone,
                password: userData.password,
                rol: userData.rol || userData.role
            };
    
            console.log("Datos enviados al servidor:", requestData);
    
            const response = await fetch(`${API_URLS.usuarios}/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requestData)
            });
    
            const data = await response.json();
            
            if (!response.ok) {
                console.error("Error del servidor:", data);
                throw new Error(data.message || "Error en el servidor");
            }
    
            return data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw new Error(error.message || "Error de conexión");
        }
    }

    static async updateUser(id, userData) {
        try {
            // Limpiar y validar datos
            const cleanData = {
                nombre: userData.nombre?.trim() || null,
                email: userData.email?.trim(),
                telefono: userData.telefono ? userData.telefono.trim() : null,
                rol: userData.rol
            };
    
            // Validación básica
            if (!cleanData.email) throw new Error("El email es requerido");
            if (!cleanData.rol) throw new Error("El rol es requerido");
    
            console.log("Enviando datos para actualización:", cleanData);
    
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(cleanData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar usuario");
            }
    
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw new Error(error.message || "Error de conexión");
        }
    }

    static async deleteUser(id) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Vehículos
class VehicleManager {
    static async getAllVehicles() {
        try {
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const vehicles = await response.json();
            return vehicles;
            
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    static async getVehicleById(id) {
        try {
            console.log(`Obteniendo vehículo con ID: ${id}`);
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener datos del vehículo');
            }
            
            const data = await response.json();
            console.log('Datos recibidos del vehículo:', data);
            return data;
        } catch (error) {
            console.error(`Error al obtener vehículo ${id}:`, error);
            throw error;
        }
    }

    static async updateVehicle(id, vehicleData) {
        try {
            // Validar que el ID existe
            if (!id) {
                throw new Error("ID de vehículo no proporcionado");
            }
            
            console.log(`Actualizando vehículo ${id}:`, vehicleData);
            
            // Validación básica
            if (!vehicleData.marca) throw new Error("La marca es obligatoria");
            if (!vehicleData.modelo) throw new Error("El modelo es obligatorio");
            if (!vehicleData.año || isNaN(vehicleData.año)) throw new Error("El año debe ser un número válido");
            if (!vehicleData.precio || isNaN(vehicleData.precio)) throw new Error("El precio debe ser un número válido");
            
            // Convertir a los tipos correctos
            const formattedData = {
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                año: parseInt(vehicleData.año || vehicleData.year),
                precio: parseFloat(vehicleData.precio || vehicleData.price),
                kilometraje: parseInt(vehicleData.kilometraje || vehicleData.mileage || 0)
            };
            
            console.log("Datos formateados para enviar:", formattedData);
            
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formattedData)
            });
            
            if (!response.ok) {
                console.error("Error del servidor:", response);
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al actualizar vehículo");
                } catch (jsonError) {
                    throw new Error("Error al actualizar el vehículo");
                }
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar vehículo ${id}:`, error);
            throw error;
        }
    }

    static async markAsSold(id) {
        try {
            // Validar que el ID existe
            if (!id) {
                throw new Error("ID de vehículo no proporcionado");
            }
            
            // Primero obtenemos los datos actuales del vehículo
            const vehicleResponse = await this.getVehicleById(id);
            console.log('Datos recibidos del vehículo:', vehicleResponse);
            
            if (!vehicleResponse || !vehicleResponse.success || !vehicleResponse.data) {
                throw new Error("No se encontró el vehículo o formato de respuesta inválido");
            }
            
            // Extraer solo los datos del vehículo (no toda la respuesta)
            const vehicleData = vehicleResponse.data;
            
            // Crear un objeto con solo los campos necesarios
            const updatedData = {
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                año: vehicleData.año,
                precio: vehicleData.precio,
                kilometraje: vehicleData.kilometraje,
                estado: 'vendido' // Cambiar el estado a vendido
            };
            
            console.log('Datos formateados para enviar:', updatedData);
            
            // Usamos la ruta de actualización normal
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                console.error(`Error al marcar vehículo ${id} como vendido:`, response);
                throw new Error('Error al marcar vehículo como vendido');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al marcar vehículo ${id} como vendido:`, error);
            throw error;
        }
    }

    static async deleteVehicle(id) {
        try {
            // Validar que el ID existe
            if (!id) {
                throw new Error("ID de vehículo no proporcionado");
            }
            
            // Primero obtenemos los datos actuales del vehículo
            const vehicleResponse = await this.getVehicleById(id);
            console.log('Datos recibidos del vehículo para eliminar:', vehicleResponse);
            
            if (!vehicleResponse || !vehicleResponse.success || !vehicleResponse.data) {
                throw new Error("No se encontró el vehículo o formato de respuesta inválido");
            }
            
            // Extraer solo los datos del vehículo (no toda la respuesta)
            const vehicleData = vehicleResponse.data;
            
            // Crear un objeto con solo los campos necesarios y marcar como eliminado
            const updatedData = {
                marca: vehicleData.marca,
                modelo: vehicleData.modelo,
                año: vehicleData.año,
                precio: vehicleData.precio,
                kilometraje: vehicleData.kilometraje,
                estado: 'eliminado' // Cambiar el estado a eliminado
            };
            
            console.log('Datos formateados para eliminar:', updatedData);
            
            // Usamos la ruta de actualización normal con método PUT
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                console.error(`Error al eliminar vehículo ${id}:`, response);
                throw new Error('Error al eliminar vehículo');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al eliminar vehículo ${id}:`, error);
            throw error;
        }
    }
    
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
}

// Gestión de Compras
class PurchaseManager {
    static async getAllPurchases() {
        try {
            const response = await fetch(`${API_URLS.compras}/compras/all/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error al obtener compras:', error);
            throw error;
        }
    }

    static async getPurchaseById(id) {
        try {
            console.log(`Obteniendo compra con ID: ${id}`);
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener datos de la compra');
            }
            
            const data = await response.json();
            console.log('Datos recibidos de la compra:', data);
            return data.data || data; // Maneja ambas estructuras de respuesta
        } catch (error) {
            console.error(`Error al obtener compra ${id}:`, error);
            throw error;
        }
    }

    static async createPurchase(purchaseData) {
        try {
            // Validaciones básicas
            if (!purchaseData.user_id) throw new Error("El ID de usuario es requerido");
            if (!purchaseData.vehicle_id) throw new Error("El ID de vehículo es requerido");
            if (!purchaseData.precio_total || isNaN(purchaseData.precio_total)) 
                throw new Error("El precio total debe ser un número válido");
                
            console.log('Creando nueva compra:', purchaseData);
            
            const response = await fetch(`${API_URLS.compras}/compras`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_id: purchaseData.user_id,
                    vehicle_id: purchaseData.vehicle_id,
                    precio_total: parseFloat(purchaseData.precio_total),
                    fecha: purchaseData.fecha || new Date().toISOString().split('T')[0],
                    metodo_pago: purchaseData.metodo_pago || 'Tarjeta',
                    estado: purchaseData.estado || 'Completado'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear compra");
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al crear compra:', error);
            throw error;
        }
    }

    static async updatePurchase(id, purchaseData) {
        try {
            // Validaciones básicas
            if (!purchaseData.user_id) throw new Error("El ID de usuario es requerido");
            if (!purchaseData.vehicle_id) throw new Error("El ID de vehículo es requerido");
            if (!purchaseData.precio_total || isNaN(purchaseData.precio_total)) 
                throw new Error("El precio total debe ser un número válido");
            
            console.log(`Actualizando compra ${id}:`, purchaseData);
            
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    user_id: purchaseData.user_id,
                    vehicle_id: purchaseData.vehicle_id,
                    precio_total: parseFloat(purchaseData.precio_total),
                    fecha: purchaseData.fecha,
                    metodo_pago: purchaseData.metodo_pago || 'Tarjeta',
                    estado: purchaseData.estado || 'Completado'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar compra");
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar compra ${id}:`, error);
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
            console.error(`Error al eliminar compra ${id}:`, error);
            throw error;
        }
    }
}

// Gestión de Visitas
class VisitManager {
    static async getAllVisits() {
        try {
            const response = await fetch(`${API_URLS.visitas}/visitas`, { // Cambiado el endpoint
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener visitas');
            }
            
            const result = await response.json();
            return result.data || result; // Maneja ambas estructuras de respuesta
        } catch (error) {
            console.error('Error al obtener visitas:', error);
            throw error;
        }
    }

    static async createVisit(visitData) {
        try {
            const response = await fetch(`${API_URLS.visitas}/visitas`, {
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

// Funciones para manejar modales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    if (modalId === 'purchaseModal' || modalId === 'visitModal') {
        loadModalSelects();
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        if (form.dataset.userId) delete form.dataset.userId;
        if (form.dataset.vehicleId) delete form.dataset.vehicleId;
        if (form.dataset.purchaseId) delete form.dataset.purchaseId;
    }
}

// Mejorar event listeners para los botones de modal
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales
    loadDashboardData();

    // Event listeners para navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.target.closest('.nav-item').getAttribute('data-section');
            showSection(section);
        });
    });

    // CORREGIDO: Event listeners para botones de modal, incluyendo botones de cierre (X)
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.closest('[data-modal]').getAttribute('data-modal');
            showModal(modalId);
        });
    });

    // CORREGIDO: Event listeners específicos para botones de cierre
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.auth-modal, .modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // CORREGIDO: Event listeners para botones secundarios (cancelar)
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.auth-modal, .modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // Setup formularios
    setupFormListeners();
});

// Función para cargar datos del dashboard
async function loadDashboardData() {
    try {
        // Mostrar indicador de carga
        showNotification('Cargando datos...', 'info');
        
        // Cargar usuarios
        const users = await UserManager.getAllUsers();
        updateUsersTable(users);
        
        // Cargar vehículos
        const vehicles = await VehicleManager.getAllVehicles();
        updateVehiclesTable(vehicles);
        
        // Cargar compras
        const purchases = await PurchaseManager.getAllPurchases();
        updatePurchasesTable(purchases);
        
        // Notificar éxito
        showNotification('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showNotification('Error al cargar datos. Por favor, intente nuevamente.', 'error');
    }
}

// Añade esta función (similar a updateVehiclesTable pero para usuarios)
function updateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    
    // Verifica si la respuesta es un objeto con propiedad data
    const usuarios = users.data || users;
    
    if (!Array.isArray(usuarios)) {
        console.error('Datos de usuarios inválidos:', users);
        tableBody.innerHTML = '<tr><td colspan="5">Error al cargar usuarios</td></tr>';
        return;
    }

    tableBody.innerHTML = usuarios.map(user => `
        <tr>
            <td>${user.nombre || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.telefono || 'N/A'}</td>
            <td>${user.rol || 'N/A'}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${user.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-delete" data-id="${user.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Añade event listeners para los botones
    document.querySelectorAll('#usersTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('users', id);
        });
    });
    
    document.querySelectorAll('#usersTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('users', id);
        });
    });
}

// Función mejorada para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Eliminar notificaciones anteriores
    document.querySelectorAll('.notification').forEach(note => note.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Añadir clase para animación de entrada
    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        // Añadir clase para animación de salida
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Validación de formularios
function validateForm(formElement, formType) {
    let isValid = true;
    
    // Validación específica según tipo de formulario
    if (formType === 'user') {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formElement.email.value)) {
            showNotification('El email no es válido', 'error');
            isValid = false;
        }
        
        // Validar contraseña en caso de creación
        if (!formElement.dataset.userId && formElement.password.value.length < 6) {
            showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            isValid = false;
        }
    } 
    else if (formType === 'vehicle') {
        // Validar año
        const currentYear = new Date().getFullYear();
        const year = parseInt(formElement.año.value);
        if (year < 1900 || year > currentYear + 1) {
            showNotification(`El año debe estar entre 1900 y ${currentYear + 1}`, 'error');
            isValid = false;
        }
        
        // Validar precio
        if (parseFloat(formElement.precio.value) <= 0) {
            showNotification('El precio debe ser mayor que 0', 'error');
            isValid = false;
        }
    }
    
    return isValid;
}

// Función para abrir el modal de edición y rellenar el formulario con los datos del vehículo
async function openEditVehicleModal(vehicleId) {
    try {
        const response = await VehicleManager.getVehicleById(vehicleId);
        const vehicle = response.data || response;

        // Asumiendo que tienes un formulario con estos IDs
        document.getElementById('editVehicleId').value = vehicle.id;
        document.getElementById('editMarca').value = vehicle.marca;
        document.getElementById('editModelo').value = vehicle.modelo;
        document.getElementById('editAño').value = vehicle.año;
        document.getElementById('editPrecio').value = vehicle.precio;
        document.getElementById('editKilometraje').value = vehicle.kilometraje;

        // Mostrar el modal (ajusta según tu implementación)
        document.getElementById('editVehicleModal').classList.add('active');
    } catch (error) {
        alert('Error al cargar datos del vehículo');
    }
}

// Función para manejar el envío del formulario de vehículo (crear o actualizar)
async function handleVehicleFormSubmit(e) {
    e.preventDefault();
    
    try {
        const form = e.target;
        const vehicleId = form.dataset.vehicleId;
        
        // Recopilar los datos del formulario
        const vehicleData = {
            marca: form.marca.value,
            modelo: form.modelo.value,
            año: parseInt(form.año.value),
            precio: parseFloat(form.precio.value),
            kilometraje: parseInt(form.kilometraje.value || 0)
        };
        
        let result;
        
        if (vehicleId) {
            // Actualizar vehículo existente
            result = await VehicleManager.updateVehicle(vehicleId, vehicleData);
            showNotification('Vehículo actualizado exitosamente');
        } else {
            // Crear nuevo vehículo
            result = await VehicleManager.createVehicle(vehicleData);
            showNotification('Vehículo creado exitosamente');
        }
        
        // Cerrar el modal
        const vehicleModal = document.getElementById('vehicleModal');
        vehicleModal.classList.remove('active');
        
        // Limpiar el formulario
        form.reset();
        delete form.dataset.vehicleId;
        
        // Recargar la tabla de vehículos
        loadVehiclesTable();
        
    } catch (error) {
        console.error('Error al procesar el formulario de vehículo:', error);
        showNotification('Error al guardar el vehículo', 'error');
    }
}

// Función para cargar los vehículos en la tabla de administración
function loadVehiclesTable() {
    const vehiclesTableBody = document.getElementById('vehiclesTableBody');
    if (!vehiclesTableBody) return;

    vehiclesTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando vehículos...</td></tr>';

    VehicleManager.getAllVehicles()
        .then(response => {
            const vehicles = response.data || response; // Ajusta según tu backend
            if (!vehicles || vehicles.length === 0) {
                vehiclesTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay vehículos registrados</td></tr>';
                return;
            }

            vehiclesTableBody.innerHTML = '';

            vehicles.forEach(vehicle => {
                const row = document.createElement('tr');
                row.setAttribute('data-vehicle-id', vehicle.id);

                row.innerHTML = `
                    <td>${vehicle.id}</td>
                    <td>${vehicle.marca}</td>
                    <td>${vehicle.modelo}</td>
                    <td>${vehicle.año}</td>
                    <td>${vehicle.precio}</td>
                    <td>${vehicle.kilometraje}</td>
                    <td>${vehicle.estado}</td>
                    <td>
                        <button class="btn-edit-vehicle" data-vehicle-id="${vehicle.id}">Editar</button>
                        <button class="btn-sold-vehicle" data-vehicle-id="${vehicle.id}">Marcar como vendido</button>
                        <button class="btn-delete-vehicle" data-vehicle-id="${vehicle.id}">Eliminar</button>
                    </td>
                `;

                vehiclesTableBody.appendChild(row);
            });

            // Eventos para editar
            document.querySelectorAll('.btn-edit-vehicle').forEach(btn => {
                btn.addEventListener('click', () => {
                    const vehicleId = btn.getAttribute('data-vehicle-id');
                    openEditVehicleModal(vehicleId);
                });
            });

            // Eventos para marcar como vendido
            document.querySelectorAll('.btn-sold-vehicle').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const vehicleId = btn.getAttribute('data-vehicle-id');
                    try {
                        await VehicleManager.markAsSold(vehicleId);
                        loadVehiclesTable();
                    } catch (error) {
                        alert('Error al marcar como vendido');
                    }
                });
            });

            // Eventos para eliminar
            document.querySelectorAll('.btn-delete-vehicle').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const vehicleId = btn.getAttribute('data-vehicle-id');
                    if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
                        try {
                            await VehicleManager.deleteVehicle(vehicleId);
                            loadVehiclesTable();
                        } catch (error) {
                            alert('Error al eliminar vehículo');
                        }
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar vehículos:', error);
            vehiclesTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Error al cargar vehículos</td></tr>';
        });
}

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Cargar tablas
    loadUsersTable();
    loadVehiclesTable();
    loadPurchasesTable();
    loadVisitsTable();
    
    // Agregar evento al formulario de edición de vehículo
    const editVehicleForm = document.getElementById('editVehicleForm');
    if (editVehicleForm) {
        editVehicleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const id = document.getElementById('editVehicleId').value;
            const vehicleData = {
                marca: document.getElementById('editMarca').value,
                modelo: document.getElementById('editModelo').value,
                año: document.getElementById('editAño').value,
                precio: document.getElementById('editPrecio').value,
                kilometraje: document.getElementById('editKilometraje').value
            };
            try {
                await VehicleManager.updateVehicle(id, vehicleData);
                document.getElementById('editVehicleModal').classList.remove('active');
                loadVehiclesTable();
            } catch (error) {
                alert('Error al actualizar vehículo');
            }
        });
    }

    // Botón para agregar nuevo vehículo
    const addVehicleBtn = document.getElementById('addVehicleBtn');
    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            const vehicleModal = document.getElementById('vehicleModal');
            const vehicleForm = document.getElementById('vehicleForm');
            const modalTitle = vehicleModal.querySelector('.modal-title');
            
            // Cambiar el título del modal
            modalTitle.textContent = 'Agregar Vehículo';
            
            // Limpiar el formulario y eliminar el ID del vehículo
            vehicleForm.reset();
            delete vehicleForm.dataset.vehicleId;
            
            // Mostrar el modal
            vehicleModal.classList.add('active');
        });
    }
    
    // Botones para cerrar modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Llama a esta función cuando cargue el dashboard de admin
    loadVehiclesTable();
});

// ... existing code ...

    // En el evento submit del userForm
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("✅ El formulario se está enviando");
    const userData = {
        nombre: userForm.name.value, // Asegúrate de que coincida con lo que espera el backend
        email: userForm.email.value,
        telefono: userForm.phone.value || null, // Campo opcional
        password: userForm.password.value,
        rol: userForm.role.value
    };

    console.log("📦 Datos del formulario:", userData);

    try {
        const userId = userForm.dataset.userId;
        if (userId) {
            // Actualizar usuario
            const result = await UserManager.updateUser(userId, userData);
            console.log('Resultado de la actualización:', result);
            showNotification('Usuario actualizado exitosamente');
            hideModal('userModal');
            await loadDashboardData();
        } else {
            // Crear usuario
            await UserManager.createUser(userData);
            showNotification('Usuario creado exitosamente');
            hideModal('userModal');
            await loadDashboardData();
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
});

    // Función para marcar vehículo como vendido con actualización de tabla
    window.markVehicleAsSold = async function(id) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');
        
        confirmMessage.textContent = `¿Está seguro de marcar este vehículo como vendido?`;
        
        confirmYesBtn.onclick = async () => {
            try {
                showNotification('Procesando...', 'info');
                await VehicleManager.markAsSold(id);
                hideModal('confirmModal');
                showNotification('Vehículo marcado como vendido exitosamente');
                loadDashboardData(); // Recargar datos para actualizar la tabla
            } catch (error) {
                console.error(`Error al marcar como vendido:`, error);
                showNotification('Error al marcar como vendido: ' + error.message, 'error');
            }
        };
        
        showModal('confirmModal');
    };

    // Mejorar función de eliminación para actualizar tablas
    window.handleDelete = function(type, id) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');

        let entityName = '';
        switch(type) {
            case 'users': entityName = 'usuario'; break;
            case 'vehicles': entityName = 'vehículo'; break;
            case 'purchases': entityName = 'compra'; break;
            case 'visits': entityName = 'visita'; break;
        }

        confirmMessage.textContent = `¿Está seguro de eliminar este ${entityName}?`;
        
        confirmYesBtn.onclick = async () => {
            try {
                showNotification('Procesando...', 'info');
                
                switch (type) {
                    case 'users':
                        await UserManager.deleteUser(id);
                        break;
                    case 'vehicles':
                        await VehicleManager.deleteVehicle(id);
                        break;
                    case 'purchases':
                        await PurchaseManager.deletePurchase(id);
                        break;
                    case 'visits':
                        // Si se implementa eliminación de visitas
                        break;
                }
                hideModal('confirmModal');
                showNotification(`${entityName} eliminado exitosamente`);
                loadDashboardData(); // Recargar datos para actualizar la tabla
            } catch (error) {
                console.error(`Error al eliminar ${entityName}:`, error);
                showNotification(`Error al eliminar ${entityName}: ` + error.message, 'error');
            }
        };

        showModal('confirmModal');
    };


// Actualización más robusta de la tabla de vehículos
function updateVehiclesTable(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    
    // Verificar la estructura de la respuesta
    if (!vehicles || !vehicles.data || !Array.isArray(vehicles.data)) {
        console.error('Formato de datos de vehículos inválido:', vehicles);
        tableBody.innerHTML = '<tr><td colspan="6">Error al cargar datos</td></tr>';
        return;
    }
    
    if (vehicles.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No hay vehículos disponibles</td></tr>';
        return;
    }
    
    tableBody.innerHTML = vehicles.data.map(vehicle => `
        <tr>
            <td>${vehicle.id}</td>
            <td>${vehicle.marca || 'N/A'}</td>
            <td>${vehicle.modelo || 'N/A'}</td>
            <td>${vehicle.año || 'N/A'}</td>
            <td>${formatCurrency(vehicle.precio)}</td>
            
            <td>${vehicle.vendido ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${vehicle.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                ${!vehicle.vendido ? `
                <button class="btn btn-success btn-sold" data-id="${vehicle.id}">
                    <i class="fas fa-check"></i> Marcar Vendido
                </button>` : ''}
                <button class="btn btn-danger btn-delete" data-id="${vehicle.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');
    
    // Añadir event listeners para los botones
    document.querySelectorAll('#vehiclesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('vehicles', id);
        });
    });
    
    document.querySelectorAll('#vehiclesTable .btn-sold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-sold').dataset.id;
            markVehicleAsSold(id);
        });
    });
    
    document.querySelectorAll('#vehiclesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('vehicles', id);
        });
    });
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Versión corregida
function updatePurchasesTable(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    
    // Verificar estructura de datos
    const compras = purchases.data || purchases;
    
    if (!Array.isArray(compras)) {
        console.error('Datos de compras inválidos:', purchases);
        tableBody.innerHTML = '<tr><td colspan="7">Error al cargar compras</td></tr>';
        return;
    }

    tableBody.innerHTML = compras.map(purchase => `
        <tr>
            <td>${purchase.user_id || 'N/A'}</td>
            <td>${purchase.vehicle_id || 'N/A'}</td>
            <td>${new Date(purchase.fecha).toLocaleDateString() || 'N/A'}</td>
            <td>${purchase.metodo_pago || 'N/A'}</td>
            <td>${formatCurrency(purchase.precio_total) || 'N/A'}</td>
            <td><span class="status-badge ${purchase.estado.toLowerCase()}">${purchase.estado}</span></td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${purchase.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-delete" data-id="${purchase.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Añadir event listeners para los botones
    document.querySelectorAll('#purchasesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-edit').dataset.id;
            handleEdit('purchases', id);
        });
    });
    
    document.querySelectorAll('#purchasesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.btn-delete').dataset.id;
            handleDelete('purchases', id);
        });
    });
}

function updateVisitsTable(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    
    // Verificar si visits es un array
    if (!Array.isArray(visits)) {
        console.error('Datos de visitas inválidos:', visits);
        tableBody.innerHTML = '<tr><td colspan="4">Error al cargar visitas</td></tr>';
        return;
    }
    
    tableBody.innerHTML = visits.map(visit => `
        <tr>
            <td>${visit.userId || visit.user_id || 'N/A'}</td>
            <td>${visit.vehicleId || visit.vehicle_id || 'N/A'}</td>
            <td>${visit.date || visit.fecha || 'N/A'}</td>
            <td>${visit.status || visit.estado || 'N/A'}</td>
        </tr>
    `).join('');
}


// Función para cambiar entre secciones
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector(`#${sectionId}`).style.display = 'block';

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Cargar datos específicos según la sección
    if (sectionId === 'usuarios') {
        loadUsersTable();
    } else if (sectionId === 'vehiculos') {
        loadVehiclesTable();
    } else if (sectionId === 'compras') {
        loadPurchasesTable();
    } else if (sectionId === 'visitas') {
        loadVisitsTable();
    }
}

// Cargar selects en modales
async function loadModalSelects() {
    try {
        const [users, vehicles] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles()
        ]);

        // Actualizar selects de usuarios
        const userSelects = document.querySelectorAll('select[name="userId"]');
        const userOptions = users.map(user => 
            `<option value="${user.id}">${user.nombre} (${user.email})</option>`
        ).join('');

        userSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un usuario</option>' + userOptions;
        });

        // Actualizar selects de vehículos
        const vehicleSelects = document.querySelectorAll('select[name="vehicleId"]');
        const vehicleOptions = vehicles.data.map(vehicle => 
            `<option value="${vehicle.id}">${vehicle.marca} ${vehicle.modelo} (${vehicle.año})</option>`
        ).join('');

        vehicleSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione un vehículo</option>' + vehicleOptions;
        });
    } catch (error) {
        console.error('Error al cargar datos para los selects:', error);
        showNotification('Error al cargar datos de los formularios', 'error');
    }


    // Función para marcar vehículo como vendido ya está definida más adelante en el código
    // Esta implementación se ha eliminado para evitar duplicación

    // Formulario de usuario
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Adaptar nombres de campos según la API
            const userData = {
                nombre: userForm.name.value,
                email: userForm.email.value,
                telefono: userForm.phone.value,
                rol: userForm.role.value
            };

            if (userForm.password.value) {
                userData.password = userForm.password.value;
            }
            if (userForm.phone.value === "undefined" || userForm.phone.value === "") {
                userData.telefono = null;
            } else {
                userData.telefono = userForm.phone.value;
            }

            try {
                const userId = userForm.dataset.userId;
                console.log('ID del usuario a actualizar:', userId);
                console.log('Datos del usuario:', userData);
                
                if (userId) {
                    await UserManager.updateUser(userId, userData);
                    showNotification('Usuario actualizado exitosamente');
                } else {
                    await UserManager.createUser(userData);
                    showNotification('Usuario creado exitosamente');
                }
                hideModal('userModal');
                loadDashboardData();
            } catch (error) {
                console.error('Error al procesar el usuario:', error);
                showNotification('Error al procesar el usuario', 'error');
            }
        });
    }

    // Formulario de compra
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const purchaseData = {
                user_id: purchaseForm.userId.value,
                vehicle_id: purchaseForm.vehicleId.value,
                precio_total: parseFloat(purchaseForm.amount.value),
                fecha: purchaseForm.date.value,
                metodo_pago: purchaseForm.paymentMethod ? purchaseForm.paymentMethod.value : 'Tarjeta',
                estado: purchaseForm.status ? purchaseForm.status.value : 'Completado'
            };

            try {
                const purchaseId = purchaseForm.dataset.purchaseId;
                console.log('ID de la compra a actualizar:', purchaseId);
                console.log('Datos de la compra:', purchaseData);
                
                if (purchaseId) {
                    await PurchaseManager.updatePurchase(purchaseId, purchaseData);
                    showNotification('Compra actualizada exitosamente');
                } else {
                    await PurchaseManager.createPurchase(purchaseData);
                    showNotification('Compra registrada exitosamente');
                }
                hideModal('purchaseModal');
                loadDashboardData();
            } catch (error) {
                console.error('Error al procesar la compra:', error);
                showNotification('Error al procesar la compra', 'error');
            }
        });
    }

    // Formulario de visita
    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const visitData = {
                userId: visitForm.userId.value,
                vehicleId: visitForm.vehicleId.value,
                date: visitForm.date.value,
                status: visitForm.status.value
            };

            try {
                await VisitManager.createVisit(visitData);
                showNotification('Visita registrada exitosamente');
                hideModal('visitModal');
                loadDashboardData();
            } catch (error) {
                console.error('Error al registrar la visita:', error);
                showNotification('Error al registrar la visita', 'error');
            }
        });
    }
}

// Manejar edición de elementos
async function handleEdit(type, id) {
    try {
        switch (type) {
            case 'users':
                const user = await UserManager.getUserById(id);
                if (user) {
                    const userForm = document.getElementById('userForm');
                    userForm.dataset.userId = user.id;
                    userForm.name.value = user.nombre || '';
                    userForm.email.value = user.email || '';
                    userForm.phone.value = user.telefono || '';
                    userForm.role.value = user.rol || 'user';
                    userForm.password.value = ''; // No mostrar contraseña
                    showModal('userModal');
                }
                break;
                
            case 'vehicles':
                const vehicle = await VehicleManager.getVehicleById(id);
                if (vehicle) {
                    const vehicleForm = document.getElementById('vehicleForm');
                    vehicleForm.dataset.vehicleId = vehicle.id;
                    vehicleForm.marca.value = vehicle.marca || '';
                    vehicleForm.modelo.value = vehicle.modelo || '';
                    vehicleForm.año.value = vehicle.año || '';
                    vehicleForm.precio.value = vehicle.precio || '';
                    vehicleForm.kilometraje.value = vehicle.kilometraje || '';
                    showModal('vehicleModal');
                }
                break;
                
            case 'purchases':
                const data = await PurchaseManager.getPurchaseById(id);
                const modalId = 'purchaseModal';
                await loadModalSelects();
                fillPurchaseForm(data);
                showModal(modalId);
                break;
        }
    } catch (error) {
        console.error(`Error al obtener datos para edición:`, error);
        showNotification('Error al cargar datos para edición', 'error');
    }
}

// Función para abrir el modal de edición de compra
function openEditPurchaseModal(purchaseId) {
    // Mostrar un indicador de carga
    const form = document.getElementById('purchaseForm');
    if (form) {
        form.innerHTML = '<p class="loading-message">Cargando datos de la compra...</p>';
    }
    
    // Mostrar el modal mientras se cargan los datos
    showModal('purchaseModal');
    
    // Obtener datos de la compra
    PurchaseManager.getPurchaseById(purchaseId)
        .then(purchase => {
            // Verificar si la respuesta tiene una estructura anidada
            const purchaseData = purchase.data || purchase;
            
            // Restablecer el formulario
            if (form) {
                form.innerHTML = ''; // Limpiar el indicador de carga
                
                // Recrear los campos del formulario
                // (Asumiendo que tienes una función para esto o puedes restaurar el HTML original)
                // Aquí deberías restaurar el HTML original del formulario
                
                // Establecer el ID en el formulario
                form.dataset.purchaseId = purchaseId;
                
                // Llenar los campos del formulario
                if (form.user_id) form.user_id.value = purchaseData.user_id || purchaseData.userId;
                if (form.vehicle_id) form.vehicle_id.value = purchaseData.vehicle_id || purchaseData.vehicleId;
                if (form.precio_total) form.precio_total.value = purchaseData.precio_total || purchaseData.precioTotal;
                if (form.fecha) form.fecha.value = purchaseData.fecha ? purchaseData.fecha.split('T')[0] : '';
                if (form.metodo_pago) form.metodo_pago.value = purchaseData.metodo_pago || purchaseData.metodoPago;
                if (form.estado) form.estado.value = purchaseData.estado;
            }
        })
        .catch(error => {
            console.error('Error al cargar compra para editar:', error);
            showNotification('Error al cargar datos de la compra', 'error');
            
            // Cerrar el modal en caso de error
            hideModal('purchaseModal');
        });
}

// Funciones para llenar formularios
function fillVehicleForm(vehicleData) {
    const form = document.getElementById('vehicleForm');
    
    // Manejo de posibles estructuras de respuesta
    const vehicle = vehicleData.data ? vehicleData.data : vehicleData;
    
    // Asegurarnos de que estamos guardando el ID correctamente en el dataset
    form.dataset.vehicleId = vehicle.id;
    
    // Llenar todos los campos con los datos recibidos
    form.marca.value = vehicle.marca || '';
    form.modelo.value = vehicle.modelo || '';
    form.año.value = vehicle.año || '';
    form.precio.value = vehicle.precio || '';
    
    console.log('Formulario de vehículo llenado con:', vehicle);
}

function fillUserForm(userData) {
    const form = document.getElementById('userForm');
    form.dataset.userId = userData.id;
    
    // Manejar posibles variaciones en los nombres de los campos
    form.name.value = userData.nombre || userData.name;
    form.email.value = userData.email;
    form.phone.value = userData.telefono || userData.phone;
    form.role.value = userData.rol || userData.role;
    form.password.value = ''; // No mostrar la contraseña actual
    
    console.log('Formulario de usuario llenado con:', userData);
}

function fillPurchaseForm(purchaseData) {
    const form = document.getElementById('purchaseForm');
    form.dataset.purchaseId = purchaseData.id;
    
    // Adaptar según la estructura real de los datos
    form.userId.value = purchaseData.user_id || purchaseData.userId;
    form.vehicleId.value = purchaseData.vehicle_id || purchaseData.vehicleId;
    form.amount.value = purchaseData.precio_total || purchaseData.amount;
    
    // Formatear fecha si viene en formato ISO
    if (purchaseData.fecha) {
        const dateStr = purchaseData.fecha.includes('T') 
            ? purchaseData.fecha.split('T')[0] 
            : purchaseData.fecha;
        form.date.value = dateStr;
    } else if (purchaseData.date) {
        const dateStr = purchaseData.date.includes('T') 
            ? purchaseData.date.split('T')[0] 
            : purchaseData.date;
        form.date.value = dateStr;
    }
    
    // Si existen estos campos en el formulario
    if (form.paymentMethod && purchaseData.metodo_pago) {
        form.paymentMethod.value = purchaseData.metodo_pago;
    }
    
    if (form.status && purchaseData.estado) {
        form.status.value = purchaseData.estado;
    }
    
    console.log('Formulario de compra llenado con:', purchaseData);
}

// Manejar eliminación de elementos
async function handleDelete(type, id) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYes');

    let entityName = '';
    switch(type) {
        case 'users': entityName = 'usuario'; break;
        case 'vehicles': entityName = 'vehículo'; break;
        case 'purchases': entityName = 'compra'; break;
        case 'visits': entityName = 'visita'; break;
    }

    confirmMessage.textContent = `¿Está seguro de eliminar este ${entityName}?`;
    
    confirmYesBtn.onclick = async () => {
        try {
            showNotification('Procesando...', 'info');
            let result;
            
            switch (type) {
                case 'users':
                    result = await UserManager.deleteUser(id);
                    break;
                case 'vehicles':
                    result = await VehicleManager.deleteVehicle(id);
                    break;
                case 'purchases':
                    result = await PurchaseManager.deletePurchase(id);
                    break;
                case 'visits':
                    // Si se implementa eliminación de visitas
                    break;
            }
            hideModal('confirmModal');
            showNotification(`${entityName} eliminado exitosamente`);
            
            if (type === 'purchases') {
                // Para compras, solo recargamos la tabla de compras
                const purchases = await PurchaseManager.getAllPurchases();
                updatePurchasesTable(purchases.data || purchases);
            } else {
                // Para otros tipos, recargamos todos los datos
                loadDashboardData();
            }
        } catch (error) {
            console.error(`Error al eliminar ${entityName}:`, error);
            showNotification(`Error al eliminar ${entityName}: ${error.message}`, 'error');
        }
    };

    showModal('confirmModal');
}

// Función para manejar la eliminación de compras
async function handleDeletePurchase(id) {
    try {
        // Mostrar diálogo de confirmación
        showConfirmDialog(
            '¿Está seguro de que desea eliminar esta compra?',
            'Esta acción no se puede deshacer.',
            async () => {
                try {
                    // Llamar al método de la API para eliminar la compra
                    const result = await PurchaseManager.deletePurchase(id);
                    
                    if (result && (result.success || result.message)) {
                        // Mostrar mensaje de éxito
                        showNotification('Compra eliminada exitosamente', 'success');
                        
                        // Eliminar la fila de la tabla
                        const purchaseRow = document.querySelector(`tr[data-purchase-id="${id}"]`);
                        if (purchaseRow) {
                            purchaseRow.remove();
                        } else {
                            // Si no se encuentra la fila, recargar toda la tabla
                            loadPurchasesTable();
                        }
                    } else {
                        showNotification('Error al eliminar la compra', 'error');
                    }
                } catch (error) {
                    console.error('Error al eliminar compra:', error);
                    showNotification(`Error al eliminar la compra: ${error.message}`, 'error');
                }
            }
        );
    } catch (error) {
        console.error('Error al manejar eliminación de compra:', error);
        showNotification('Error al procesar la solicitud', 'error');
    }
}

// Función para manejar la eliminación de usuarios
async function handleDeleteUser(userId) {
    try {
        if (confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
            // Llamar al método de la API para eliminar el usuario
            const result = await UserManager.deleteUser(userId);
            
            if (result.message) {
                // Mostrar mensaje de éxito
                showNotification('Usuario eliminado exitosamente', 'success');
                
                // Eliminar la fila de la tabla
                const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
                if (userRow) {
                    userRow.remove();
                } else {
                    // Si no se encuentra la fila, recargar toda la tabla
                    loadUsersTable();
                }
            } else {
                showNotification('Error al eliminar el usuario', 'error');
            }
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        showNotification('Error al eliminar el usuario', 'error');
    }
}

// Función para inicializar los event listeners del panel de administrador
function initAdminDashboard() {
    // Botones de gestión de vehículos
    document.getElementById('addVehicleBtn').addEventListener('click', showAddVehicleForm);
    document.getElementById('vehicleForm').addEventListener('submit', handleVehicleSubmit);
    
    // Botones de gestión de usuarios
    document.getElementById('viewUsersBtn').addEventListener('click', loadAllUsers);
    
    // Botones de gestión de compras
    document.getElementById('viewPurchasesBtn').addEventListener('click', loadAllPurchases);
    
    // Botones de gestión de visitas
    document.getElementById('viewVisitsBtn').addEventListener('click', loadAllVisits);
    
    // Cargar datos iniciales
    loadAllVehicles();
}

// Manejador para el formulario de vehículos
async function handleVehicleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const vehicleId = form.dataset.vehicleId;
    
    try {
        const vehicleData = {
            marca: form.marca.value,
            modelo: form.modelo.value,
            año: parseInt(form.año.value),
            precio: parseFloat(form.precio.value),
            kilometraje: parseInt(form.kilometraje.value)
        };
        
        let result;
        if (vehicleId) {
            // Actualizar vehículo existente
            result = await VehicleManager.updateVehicle(vehicleId, vehicleData);
            showNotification('Vehículo actualizado exitosamente');
        } else {
            // Crear nuevo vehículo
            result = await VehicleManager.createVehicle(vehicleData);
            showNotification('Vehículo creado exitosamente');
        }
        
        form.reset();
        delete form.dataset.vehicleId;
        loadAllVehicles();
    } catch (error) {
        showNotification('Error al procesar el vehículo: ' + error.message, 'error');
    }
}

// Función para cargar todos los vehículos
async function loadAllVehicles() {
    try {
        const vehicles = await VehicleManager.getAllVehicles();
        displayVehicles(vehicles.data || vehicles);
    } catch (error) {
        showNotification('Error al cargar vehículos: ' + error.message, 'error');
    }
}

// Función para cargar la tabla de compras
function loadPurchasesTable() {
    const purchasesTableBody = document.querySelector('#purchasesTable tbody');
    if (!purchasesTableBody) return;

    purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando compras...</td></tr>';

    PurchaseManager.getAllPurchases()
        .then(response => {
            console.log('Respuesta de compras:', response);
            const purchases = Array.isArray(response) ? response : (response.data || []);
            
            if (!purchases || purchases.length === 0) {
                purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No hay compras registradas</td></tr>';
                return;
            }

            displayPurchases(purchases);
        })
        .catch(error => {
            console.error('Error al cargar compras:', error);
            purchasesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Error al cargar compras</td></tr>';
        });
}

// Función para mostrar los vehículos en la tabla
function displayVehicles(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.marca}</td>
            <td>${vehicle.modelo}</td>
            <td>${vehicle.año}</td>
            <td>${vehicle.precio}</td>
            <td>${vehicle.kilometraje}</td>
            <td>${vehicle.estado || 'disponible'}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-vehicle" data-id="${vehicle.id}">Editar</button>
                <button class="btn btn-sm btn-success mark-sold" data-id="${vehicle.id}">Marcar Vendido</button>
                <button class="btn btn-sm btn-danger delete-vehicle" data-id="${vehicle.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-vehicle').forEach(btn => {
        btn.addEventListener('click', () => editVehicle(btn.dataset.id));
    });
    
    document.querySelectorAll('.mark-sold').forEach(btn => {
        btn.addEventListener('click', () => markVehicleAsSold(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-vehicle').forEach(btn => {
        btn.addEventListener('click', () => deleteVehicle(btn.dataset.id));
    });
}

// Función para mostrar el formulario de añadir vehículo
function showAddVehicleForm() {
    const form = document.getElementById('vehicleForm');
    form.reset();
    delete form.dataset.vehicleId;
    document.getElementById('vehicleFormTitle').textContent = 'Añadir Nuevo Vehículo';
    showSection('add-vehicle');
}

// Función para editar un vehículo
async function editVehicle(id) {
    try {
        const vehicle = await VehicleManager.getVehicleById(id);
        const form = document.getElementById('vehicleForm');
        
        if (vehicle && vehicle.data) {
            form.marca.value = vehicle.data.marca;
            form.modelo.value = vehicle.data.modelo;
            form.año.value = vehicle.data.año;
            form.precio.value = vehicle.data.precio;
            form.kilometraje.value = vehicle.data.kilometraje;
            
            form.dataset.vehicleId = id;
            document.getElementById('vehicleFormTitle').textContent = 'Editar Vehículo';
            showSection('add-vehicle');
        }
    } catch (error) {
        showNotification('Error al cargar datos del vehículo: ' + error.message, 'error');
    }
}

// Función para marcar un vehículo como vendido
async function markVehicleAsSold(id) {
    if (confirm('¿Está seguro de marcar este vehículo como vendido?')) {
        try {
            await VehicleManager.markAsSold(id);
            showNotification('Vehículo marcado como vendido exitosamente');
            loadAllVehicles();
        } catch (error) {
            showNotification('Error al marcar vehículo como vendido: ' + error.message, 'error');
        }
    }
}

// Función para eliminar un vehículo
async function deleteVehicle(id) {
    if (confirm('¿Está seguro de eliminar este vehículo? Esta acción no se puede deshacer.')) {
        try {
            await VehicleManager.deleteVehicle(id);
            showNotification('Vehículo eliminado exitosamente');
            loadAllVehicles();
        } catch (error) {
            showNotification('Error al eliminar vehículo: ' + error.message, 'error');
        }
    }
}

// Función para cargar todos los usuarios
async function loadAllUsers() {
    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showNotification('Error al cargar usuarios: ' + error.message, 'error');
    }
}

// Función para mostrar los usuarios en la tabla
function displayUsers(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.telefono || 'N/A'}</td>
            <td>${user.rol || 'user'}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', () => editUser(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
}

// Función para cargar todas las compras
async function loadAllPurchases() {
    try {
        const response = await fetch(`${API_URLS.compras}/compras/all`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const purchases = await response.json();
        displayPurchases(purchases);
    } catch (error) {
        showNotification('Error al cargar compras: ' + error.message, 'error');
    }
}

// Función para mostrar las compras en la tabla
function displayPurchases(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    purchases.forEach(purchase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.id}</td>
            <td>${purchase.user_id}</td>
            <td>${purchase.vehicle_id}</td>
            <td>${new Date(purchase.fecha).toLocaleDateString()}</td>
            <td>${purchase.precio_total}</td>
            <td>${purchase.metodo_pago}</td>
            <td>${purchase.estado}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-purchase" data-id="${purchase.id}">Editar</button>
                <button class="btn btn-sm btn-success complete-purchase" data-id="${purchase.id}">Completar</button>
                <button class="btn btn-sm btn-danger delete-purchase" data-id="${purchase.id}">Cancelar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.edit-purchase').forEach(btn => {
        btn.addEventListener('click', () => editPurchase(btn.dataset.id));
    });
    
    document.querySelectorAll('.complete-purchase').forEach(btn => {
        btn.addEventListener('click', () => completePurchase(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-purchase').forEach(btn => {
        btn.addEventListener('click', () => deletePurchase(btn.dataset.id));
    });
}

// Función para cargar todas las visitas
async function loadAllVisits() {
    try {
        const response = await fetch(`${API_URLS.compras}/compras/visitasver`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const visits = await response.json();
        displayVisits(visits);
    } catch (error) {
        showNotification('Error al cargar visitas: ' + error.message, 'error');
    }
}

// Función para mostrar las visitas en la tabla
function displayVisits(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    visits.forEach(visit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${visit.id}</td>
            <td>${visit.user_id}</td>
            <td>${visit.vehicle_id}</td>
            <td>${new Date(visit.fecha).toLocaleDateString()}</td>
            <td>${visit.asistio ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-sm btn-primary create-purchase" data-id="${visit.id}" 
                data-user="${visit.user_id}" data-vehicle="${visit.vehicle_id}">Crear Compra</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Añadir event listeners a los botones de acción
    document.querySelectorAll('.create-purchase').forEach(btn => {
        btn.addEventListener('click', () => createPurchaseFromVisit(
            btn.dataset.id, 
            btn.dataset.user, 
            btn.dataset.vehicle
        ));
    });
}


// Clase para manejar la sincronización entre API y UI
class DataSyncManager {
    // Método para recargar datos específicos después de una operación
    static async reloadAfterOperation(operationType, entityType) {
        try {
            showNotification(`${operationType} exitoso`, 'success');
            
            // Para operaciones que afectan a una sola tabla, solo recargamos esa tabla
            if (entityType) {
                await DataSyncManager.reloadSpecificTable(entityType);
            } else {
                // Para operaciones más complejas, recargamos todo
                await loadDashboardData();
            }
        } catch (error) {
            console.error(`Error al recargar datos después de ${operationType}:`, error);
            showNotification(`Error al actualizar la interfaz: ${error.message}`, 'error');
        }
    }
    
    // Método para recargar una tabla específica
    static async reloadSpecificTable(entityType) {
        try {
            switch (entityType) {
                case 'users':
                    const users = await UserManager.getAllUsers();
                    updateUsersTable(users);
                    break;
                case 'vehicles':
                    const vehicles = await VehicleManager.getAllVehicles();
                    updateVehiclesTable(vehicles);
                    break;
                case 'purchases':
                    const purchases = await PurchaseManager.getAllPurchases();
                    updatePurchasesTable(purchases);
                    break;
                case 'visits':
                    const visits = await VisitManager.getAllVisits();
                    updateVisitsTable(visits.data);
                    break;
            }
        } catch (error) {
            console.error(`Error al recargar tabla ${entityType}:`, error);
            throw error;
        }
    }
    
    // Método para confirmar operaciones críticas
    static confirmOperation(message, callback) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');
        
        confirmMessage.textContent = message;
        confirmYesBtn.onclick = callback;
        
        showModal('confirmModal');
    }
}

// Ahora mejoremos las operaciones CRUD
// 1. Crear vehículo con sincronización
async function createOrUpdateVehicle(vehicleForm) {
    try {
        const vehicleId = vehicleForm.dataset.vehicleId;
        const vehicleData = {
            marca: vehicleForm.marca.value,
            modelo: vehicleForm.modelo.value,
            año: parseInt(vehicleForm.año.value),
            precio: parseFloat(vehicleForm.precio.value)
        };
        
        showNotification('Procesando...', 'info');
        
        if (vehicleId) {
            await VehicleManager.updateVehicle(vehicleId, vehicleData);
            hideModal('vehicleModal');
            await DataSyncManager.reloadAfterOperation('Actualización', 'vehicles');
        } else {
            await VehicleManager.createVehicle(vehicleData);
            hideModal('vehicleModal');
            await DataSyncManager.reloadAfterOperation('Creación', 'vehicles');
        }
    } catch (error) {
        console.error('Error en operación de vehículo:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}


// 3. Eliminar entidad con confirmación y sincronización
function deleteEntity(entityType, id) {
    let entityName = '';
    let managerMethod = null;
    
    switch(entityType) {
        case 'users': 
            entityName = 'usuario'; 
            managerMethod = UserManager.deleteUser;
            break;
        case 'vehicles': 
            entityName = 'vehículo'; 
            managerMethod = VehicleManager.deleteVehicle;
            break;
        case 'purchases': 
            entityName = 'compra'; 
            managerMethod = PurchaseManager.deletePurchase;
            break;
    }
    
    DataSyncManager.confirmOperation(`¿Está seguro de eliminar este ${entityName}?`, async () => {
        try {
            showNotification('Procesando...', 'info');
            await managerMethod(id);
            hideModal('confirmModal');
            
            // Si eliminamos un usuario o vehículo, puede afectar a compras y visitas
            if (entityType === 'users' || entityType === 'vehicles') {
                await loadDashboardData();
            } else {
                await DataSyncManager.reloadAfterOperation('Eliminación', entityType);
            }
        } catch (error) {
            console.error(`Error al eliminar ${entityName}:`, error);
            showNotification(`Error: ${error.message}`, 'error');
        }
    });
}

// Exportar las clases para uso en otros módulos
export {
    UserManager,
    VehicleManager,
    PurchaseManager,
    VisitManager
};