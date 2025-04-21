import { UserManager, VehicleManager, VisitManager, checkAuth } from './api-dashboard.js';
import { API_URLS } from './config.js';

// Manejadores de eventos UI
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadUserData();
    loadUserVehicles();
    loadUserVisits();
    loadUserPurchases();
});

function setupEventListeners() {
    // Navegación
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Eliminar cuenta
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', handleDeleteAccount);
    }

    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Formulario de vehículo
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', handleVehicleCreate);
    }

    // Formulario de recuperación de contraseña
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // Formulario de registrar visita
    const visitForm = document.getElementById('visitForm');
    if (visitForm) {
        visitForm.addEventListener('submit', handleVisitCreate);
    }
}

// Funciones de manejo de eventos
async function handleLogout() {
    try {
        await UserManager.logoutServer(); // Cerrar sesión en el servidor
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    } catch (error) {
        // Si hay error en el servidor igual cerrar sesión localmente
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}

async function handleDeleteAccount() {
    if (confirm('¿Está seguro de eliminar su cuenta? Esta acción no se puede deshacer.')) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await UserManager.deleteAccount(user.id);
            handleLogout();
        } catch (error) {
            showNotification('Error al eliminar cuenta', 'error');
        }
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const form = e.target;

    try {
        const userData = {
            id: user.id,
            nombre: form.profileName.value,
            email: form.profileEmail.value,
            telefono: form.profilePhone.value
        };

        // Si hay nueva contraseña, cambiamos la contraseña
        if (form.newPassword.value) {
            if (!form.currentPassword.value) {
                showNotification('Debe ingresar su contraseña actual', 'error');
                return;
            }
            
            const passwordResult = await UserManager.changePassword(
                user.id,
                form.currentPassword.value,
                form.newPassword.value
            );
            
            if (passwordResult.error) {
                showNotification(passwordResult.message || 'Error al cambiar contraseña', 'error');
                return;
            }
            
            showNotification('Contraseña actualizada exitosamente');
            form.currentPassword.value = '';
            form.newPassword.value = '';
        }

        const profileResult = await UserManager.updateProfile(userData);
        
        if (profileResult.error) {
            showNotification(profileResult.message || 'Error al actualizar perfil', 'error');
            return;
        }
        
        // Actualizar datos de usuario en localStorage
        const updatedUser = {...user, ...userData};
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        showNotification('Perfil actualizado exitosamente');
    } catch (error) {
        showNotification('Error al actualizar perfil', 'error');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value;
    
    try {
        const result = await UserManager.recoverPassword(email);
        if (result.error) {
            showNotification(result.message || 'Error al recuperar contraseña', 'error');
        } else {
            showNotification('Revise su correo para instrucciones de recuperación');
            hideModal('forgotPasswordModal');
        }
    } catch (error) {
        showNotification('Error al procesar la solicitud', 'error');
    }
}

async function handleVehicleCreate(e) {
    e.preventDefault();
    const form = e.target;
    const vehicleId = form.dataset.vehicleId;

    try {
        const vehicleData = {
            marca: form.marca.value,
            modelo: form.modelo.value,
            año: parseInt(form.año.value),
            precio: parseInt(form.precio.value),
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
            showNotification('Vehículo registrado exitosamente');
        }

        form.reset();
        delete form.dataset.vehicleId;
        loadUserVehicles();
        showSection('mis-vehiculos');
    } catch (error) {
        showNotification('Error al procesar el vehículo', 'error');
    }
}

async function handleVisitCreate(e) {
    e.preventDefault();
    const form = e.target;

    try {
        const visitData = {
            userId: JSON.parse(localStorage.getItem('user')).id,
            vehicleId: parseInt(form.vehicleId.value),
            date: form.visitDate.value,
            status: 'pendiente'
        };

        await VisitManager.createVisit(visitData);
        form.reset();
        showNotification('Visita registrada exitosamente');
        loadUserVisits();
    } catch (error) {
        showNotification('Error al registrar visita', 'error');
    }
}

// Funciones de carga de datos
async function loadUserData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.profileName.value = user.nombre || '';
            profileForm.profileEmail.value = user.email || '';
            profileForm.profilePhone.value = user.telefono || '';
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

async function loadUserVehicles() {
    try {
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos/user`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const vehicles = await response.json();
        updateVehiclesList(vehicles);
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
}

async function loadUserVisits() {
    try {
        const visits = await VisitManager.getUserVisits();
        updateVisitsList(visits);
    } catch (error) {
        console.error('Error al cargar visitas:', error);
    }
}

async function loadUserPurchases() {
    try {
        const response = await fetch(`${API_URLS.compras}/compras/user`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const purchases = await response.json();
        updatePurchasesList(purchases);
    } catch (error) {
        console.error('Error al cargar compras:', error);
    }
}

// Funciones de actualización de UI
function updateVehiclesList(vehicles) {
    const container = document.getElementById('myVehiclesContainer');
    if (!container || !vehicles || !Array.isArray(vehicles)) return;

    if (vehicles.length === 0) {
        container.innerHTML = '<p>No tienes vehículos registrados.</p>';
        return;
    }

    container.innerHTML = vehicles.map(vehicle => `
        <div class="vehicle-card">
            <img src="${vehicle.imagen || '../img/default-car.jpg'}" alt="${vehicle.marca} ${vehicle.modelo}">
            <h3>${vehicle.marca} ${vehicle.modelo}</h3>
            <p>Año: ${vehicle.año}</p>
            <p>Precio: $${vehicle.precio}</p>
            <p>Kilometraje: ${vehicle.kilometraje} km</p>
            <div class="vehicle-actions">
                <button class="btn btn-primary" onclick="editVehicle(${vehicle.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteVehicle(${vehicle.id})">Eliminar</button>
                ${vehicle.vendido ? 
                    '<span class="status-sold">Vendido</span>' : 
                    `<button class="btn btn-success" onclick="markAsSold(${vehicle.id})">Marcar como vendido</button>`}
            </div>
        </div>
    `).join('');
}

function updateVisitsList(visits) {
    const container = document.getElementById('myVisitsContainer');
    if (!container || !visits || !Array.isArray(visits)) return;

    if (visits.length === 0) {
        container.innerHTML = '<p>No tienes visitas programadas.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Vehículo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${visits.map(visit => `
                    <tr>
                        <td>${visit.vehicleBrand} ${visit.vehicleModel}</td>
                        <td>${formatDate(visit.date)}</td>
                        <td>${formatStatus(visit.status)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function updatePurchasesList(purchases) {
    const container = document.getElementById('myPurchasesContainer');
    if (!container || !purchases || !Array.isArray(purchases)) return;

    if (purchases.length === 0) {
        container.innerHTML = '<p>No tienes compras registradas.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Vehículo</th>
                    <th>Fecha</th>
                    <th>Precio</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${purchases.map(purchase => `
                    <tr>
                        <td>${purchase.vehicleBrand} ${purchase.vehicleModel}</td>
                        <td>${formatDate(purchase.fecha)}</td>
                        <td>$${purchase.precio_total}</td>
                        <td>${formatStatus(purchase.estado)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Funciones auxiliares
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.sidebar ul li a[href="#${sectionId}"]`).parentElement.classList.add('active');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatStatus(status) {
    const statusMap = {
        'pendiente': '<span class="status-pending">Pendiente</span>',
        'confirmada': '<span class="status-confirmed">Confirmada</span>',
        'cancelada': '<span class="status-cancelled">Cancelada</span>',
        'completada': '<span class="status-completed">Completada</span>'
    };
    
    return statusMap[status.toLowerCase()] || status;
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Funciones globales para los botones de vehículos
window.editVehicle = async (id) => {
    try {
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const vehicle = await response.json();
        
        // Llenar formulario de edición
        const form = document.getElementById('vehicleForm');
        form.dataset.vehicleId = vehicle.id;
        form.marca.value = vehicle.marca;
        form.modelo.value = vehicle.modelo;
        form.año.value = vehicle.año;
        form.precio.value = vehicle.precio;
        form.kilometraje.value = vehicle.kilometraje;
        
        // Cambiar a sección de edición
        showSection('registrar-vehiculo');
    } catch (error) {
        showNotification('Error al cargar vehículo', 'error');
    }
};

window.deleteVehicle = async (id) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
        try {
            await VehicleManager.deleteVehicle(id);
            showNotification('Vehículo eliminado exitosamente');
            loadUserVehicles();
        } catch (error) {
            showNotification('Error al eliminar vehículo', 'error');
        }
    }
};

window.markAsSold = async (id) => {
    try {
        await VehicleManager.markAsSold(id);
        showNotification('Vehículo marcado como vendido');
        loadUserVehicles();
    } catch (error) {
        showNotification('Error al marcar vehículo como vendido', 'error');
    }
};

// Mostar modal de recuperación de contraseña
window.showForgotPasswordModal = () => {
    showModal('forgotPasswordModal');
};