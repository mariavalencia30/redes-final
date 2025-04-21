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
            const response = await fetch(`${API_URLS.usuarios}/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    static async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar usuario ${id}:`, error);
            throw error;
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
            const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener vehículo ${id}:`, error);
            throw error;
        }
    }

    static async updateVehicle(id, vehicleData) {
        try {
            console.log(`Actualizando vehículo ${id}:`, vehicleData);
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
            console.error(`Error al actualizar vehículo ${id}:`, error);
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
            console.error(`Error al marcar vehículo ${id} como vendido:`, error);
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
            const response = await fetch(`${API_URLS.compras}/compras/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener compra ${id}:`, error);
            throw error;
        }
    }

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
            const response = await fetch(`${API_URLS.compras}/compras/visitasver/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const visitas = await response.json();
            return visitas;
            
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

// Manejadores de eventos UI
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

    // Event listeners para botones de modal
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.closest('[data-modal]').getAttribute('data-modal');
            if (e.target.classList.contains('close-modal') || e.target.classList.contains('btn-secondary')) {
                hideModal(modalId);
            } else {
                showModal(modalId);
            }
        });
    });

    // Setup formularios
    setupFormListeners();
});

// Función para cargar datos del dashboard
async function loadDashboardData() {
    try {
        const [users, vehicles, purchases, visits] = await Promise.all([
            UserManager.getAllUsers(),
            VehicleManager.getAllVehicles(),
            PurchaseManager.getAllPurchases(),
            VisitManager.getAllVisits()
        ]);
        console.log('Usuarios cargados:', users);
        console.log('Vehículos cargados:', vehicles);
        console.log('Compras cargadas:', purchases);
        console.log('Visitas cargadas:', visits);
        
        updateUsersTable(users);
        updateVehiclesTable(vehicles);
        updatePurchasesTable(purchases);
        updateVisitsTable(visits);
    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        showNotification('Error al cargar datos', 'error');
    }
}

// Funciones de actualización de tablas
function updateUsersTable(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.telefono}</td>
            <td>${user.rol}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${user.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    // Añadir event listeners para los botones de edición
    document.querySelectorAll('#usersTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleEdit('users', id);
        });
    });
    
    // Añadir event listeners para los botones de eliminación
    document.querySelectorAll('#usersTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleDelete('users', id);
        });
    });
}

function updateVehiclesTable(vehicles) {
    const tableBody = document.querySelector('#vehiclesTable tbody');
    tableBody.innerHTML = vehicles.data.map(vehicle => `
        <tr>
            <td>${vehicle.id}</td>
            <td>${vehicle.marca}</td>
            <td>${vehicle.modelo}</td>
            <td>${vehicle.año}</td>
            <td>${vehicle.precio}</td>
            <td>${vehicle.vendido ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${vehicle.id}">Editar</button>
                <button class="btn btn-success btn-sold" data-id="${vehicle.id}">Marcar Vendido</button>
                <button class="btn btn-danger btn-delete" data-id="${vehicle.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    // Añadir event listeners para los botones de edición
    document.querySelectorAll('#vehiclesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleEdit('vehicles', id);
        });
    });
    
    // Añadir event listeners para los botones de marcar como vendido
    document.querySelectorAll('#vehiclesTable .btn-sold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            markVehicleAsSold(id);
        });
    });
    
    // Añadir event listeners para los botones de eliminación
    document.querySelectorAll('#vehiclesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleDelete('vehicles', id);
        });
    });
}

function updatePurchasesTable(purchases) {
    const tableBody = document.querySelector('#purchasesTable tbody');
    tableBody.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${purchase.user_id}</td>
            <td>${purchase.vehicle_id}</td>
            <td>${purchase.fecha}</td>
            <td>${purchase.precio_total}</td>
            <td>${purchase.metodo_pago}</td>
            <td>${purchase.estado}</td>
            <td>
                <button class="btn btn-primary btn-edit" data-id="${purchase.id}">Editar</button>
                <button class="btn btn-danger btn-delete" data-id="${purchase.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    // Añadir event listeners para los botones de edición y eliminación
    document.querySelectorAll('#purchasesTable .btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleEdit('purchases', id);
        });
    });
    
    document.querySelectorAll('#purchasesTable .btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            handleDelete('purchases', id);
        });
    });
}

function updateVisitsTable(visits) {
    const tableBody = document.querySelector('#visitsTable tbody');
    tableBody.innerHTML = visits.map(visit => `
        <tr>
            <td>${visit.userId}</td>
            <td>${visit.vehicleId}</td>
            <td>${visit.date}</td>
            <td>${visit.status}</td>
        </tr>
    `).join('');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para cambiar entre secciones
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelector(`#${sectionId}`).style.display = 'block';

    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
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
}

// Configuración de listeners para formularios
function setupFormListeners() {
    // Formulario de vehículo
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vehicleData = {
                marca: vehicleForm.marca.value,
                modelo: vehicleForm.modelo.value,
                año: parseInt(vehicleForm.año.value),
                precio: parseFloat(vehicleForm.precio.value)
            };

            try {
                const vehicleId = vehicleForm.dataset.vehicleId;
                console.log('ID del vehículo a actualizar:', vehicleId);
                console.log('Datos del vehículo:', vehicleData);
                
                if (vehicleId) {
                    // Si hay un ID, es una actualización
                    await VehicleManager.updateVehicle(vehicleId, vehicleData);
                    showNotification('Vehículo actualizado exitosamente');
                } else {
                    // Si no hay ID, es una creación
                    await VehicleManager.createVehicle(vehicleData);
                    showNotification('Vehículo creado exitosamente');
                }
                hideModal('vehicleModal');
                loadDashboardData(); // Recargar datos para actualizar la tabla
            } catch (error) {
                console.error('Error al procesar el vehículo:', error);
                showNotification('Error al procesar el vehículo', 'error');
            }
        });
    }

    // Función para marcar vehículo como vendido
    function markVehicleAsSold(id) {
        const confirmModal = document.getElementById('confirmModal');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYesBtn = document.getElementById('confirmYes');
        
        confirmMessage.textContent = `¿Está seguro de marcar este vehículo como vendido?`;
        
        confirmYesBtn.onclick = async () => {
            try {
                await VehicleManager.markAsSold(id);
                showNotification('Vehículo marcado como vendido');
                hideModal('confirmModal');
                loadDashboardData();
            } catch (error) {
                console.error(`Error al marcar como vendido:`, error);
                showNotification('Error al marcar como vendido', 'error');
            }
        };
        
        showModal('confirmModal');
    }

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
        let data;
        let modalId;

        switch (type) {
            case 'users':
                data = await UserManager.getUserById(id);
                modalId = 'userModal';
                fillUserForm(data);
                break;
            case 'vehicles':
                data = await VehicleManager.getVehicleById(id);
                modalId = 'vehicleModal';
                fillVehicleForm(data);
                break;
            case 'purchases':
                data = await PurchaseManager.getPurchaseById(id);
                modalId = 'purchaseModal';
                await loadModalSelects();
                fillPurchaseForm(data);
                break;
        }

        if (modalId) {
            showModal(modalId);
        }
    } catch (error) {
        console.error(`Error al cargar datos para edición:`, error);
        showNotification('Error al cargar datos', 'error');
    }
}

// Funciones para llenar formularios
function fillVehicleForm(vehicleData) {
    const form = document.getElementById('vehicleForm');
    // Asegurarnos de que estamos guardando el ID correctamente en el dataset
    form.dataset.vehicleId = vehicleData.id;
    
    // Llenar todos los campos con los datos recibidos
    form.marca.value = vehicleData.marca;
    form.modelo.value = vehicleData.modelo;
    form.año.value = vehicleData.año;
    form.precio.value = vehicleData.precio;
    
    console.log('Formulario de vehículo llenado con:', vehicleData);
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
function handleDelete(type, id) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYes');

    confirmMessage.textContent = `¿Está seguro de eliminar este ${type.slice(0, -1)}?`;
    
    confirmYesBtn.onclick = async () => {
        try {
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
            }
            hideModal('confirmModal');
            showNotification(`${type.slice(0, -1)} eliminado exitosamente`);
            loadDashboardData();
        } catch (error) {
            console.error(`Error al eliminar ${type.slice(0, -1)}:`, error);
            showNotification(`Error al eliminar ${type.slice(0, -1)}`, 'error');
        }
    };

    showModal('confirmModal');
}

// Exportar las clases para uso en otros módulos
export {
    UserManager,
    VehicleManager,
    PurchaseManager,
    VisitManager
};