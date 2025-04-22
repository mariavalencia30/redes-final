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

// Función para recuperar contraseña
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

// Función para cambiar contraseña y actualizar perfil
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

        // Cambiar contraseña si se solicita
        if (form.newPassword.value) {
            if (!form.currentPassword.value) {
                showNotification('Debe ingresar su contraseña actual', 'error');
                return;
            }
            
            try {
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
            } catch (error) {
                showNotification('Error al cambiar contraseña', 'error');
                return;
            }
        }

        // Actualizar perfil
        const profileResult = await UserManager.updateProfile(userData);
        if (profileResult.error) {
            showNotification(profileResult.message || 'Error al actualizar perfil', 'error');
            return;
        }
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showNotification('Perfil actualizado exitosamente');
    } catch (error) {
        showNotification('Error al actualizar perfil', 'error');
    }
}

// Función para crear vehículo
async function handleVehicleCreate(e) {
    e.preventDefault();
    const form = e.target;
    
    try {
        const vehicleData = {
            marca: form.marca.value,
            modelo: form.modelo.value,
            año: form.año.value,
            precio: form.precio.value,
            kilometraje: form.kilometraje.value
        };
        
        const result = await VehicleManager.createVehicle(vehicleData);
        
        if (result.error) {
            showNotification(result.message || 'Error al registrar vehículo', 'error');
            return;
        }
        
        showNotification('Vehículo registrado exitosamente');
        form.reset();
        loadUserVehicles();
        showSection('mis-vehiculos');
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        showNotification('Error al procesar el vehículo', 'error');
    }
}

// Función para registrar visita
async function handleVisitCreate(e) {
    e.preventDefault();
    const form = e.target;
    
    try {
        const visitData = {
            vehicleId: form.vehicleId.value,
            date: form.visitDate.value
        };
        
        const result = await VisitManager.createVisit(visitData);
        
        if (result.error) {
            showNotification(result.message || 'Error al programar visita', 'error');
            return;
        }
        
        showNotification('Visita programada exitosamente');
        form.reset();
        loadUserVisits();
        showSection('mis-visitas');
    } catch (error) {
        console.error('Error al programar visita:', error);
        showNotification('Error al programar la visita', 'error');
    }
}

// Cargar datos del usuario
async function loadUserData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;
        
        // Cargar datos en el formulario de perfil
        document.getElementById('profileName').value = user.nombre || user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profilePhone').value = user.telefono || user.phone || '';
        
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

// Cargar vehículos del usuario
async function loadUserVehicles() {
    const container = document.getElementById('myVehiclesContainer');
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Cargando vehículos...</p>';
    
    try {
        // Obtener el ID del usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            container.innerHTML = '<p class="error">No se pudo identificar al usuario</p>';
            return;
        }
        
        // Corregir la URL para obtener los vehículos del usuario
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos/usuario/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener vehículos');
        }
        
        const data = await response.json();
        const vehicles = data.data || [];
        
        if (vehicles.length === 0) {
            container.innerHTML = '<p class="empty">No tienes vehículos registrados</p>';
            return;
        }
        
        // Mostrar los vehículos
        container.innerHTML = '';
        vehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = 'vehicle-card';
            vehicleCard.innerHTML = `
                <h3>${vehicle.marca} ${vehicle.modelo}</h3>
                <p>Año: ${vehicle.año}</p>
                <p>Precio: $${vehicle.precio}</p>
                <p>Kilometraje: ${vehicle.kilometraje} km</p>
                <p>Estado: ${vehicle.estado}</p>
                <div class="vehicle-actions">
                    <button class="btn btn-primary edit-vehicle" data-id="${vehicle.id}">Editar</button>
                    <button class="btn btn-danger delete-vehicle" data-id="${vehicle.id}">Eliminar</button>
                </div>
            `;
            container.appendChild(vehicleCard);
        });
        
        // Agregar eventos a los botones
        document.querySelectorAll('.edit-vehicle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const vehicleId = e.target.getAttribute('data-id');
                // Implementar edición de vehículo
            });
        });
        
        document.querySelectorAll('.delete-vehicle').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const vehicleId = e.target.getAttribute('data-id');
                if (confirm('¿Está seguro de eliminar este vehículo?')) {
                    try {
                        await VehicleManager.deleteVehicle(vehicleId);
                        showNotification('Vehículo eliminado exitosamente');
                        loadUserVehicles();
                    } catch (error) {
                        showNotification('Error al eliminar vehículo', 'error');
                    }
                }
            });
        });
        
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
        container.innerHTML = '<p class="error">Error al cargar vehículos</p>';
    }
}

// Cargar visitas del usuario
async function loadUserVisits() {
    const container = document.getElementById('myVisitsContainer');
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Cargando visitas...</p>';
    
    try {
        // Obtener el ID del usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            container.innerHTML = '<p class="error">No se pudo identificar al usuario</p>';
            return;
        }
        
        // Intentar obtener las visitas del usuario
        const response = await fetch(`${API_URLS.compras}/compras/visitas/user/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener visitas');
        }
        
        const data = await response.json();
        const visits = data.data || [];
        
        if (visits.length === 0) {
            container.innerHTML = '<p class="empty">No tienes visitas programadas</p>';
            return;
        }
        
        // Mostrar las visitas
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Vehículo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="visitsTableBody"></tbody>
            </table>
        `;
        
        const tableBody = document.getElementById('visitsTableBody');
        
        visits.forEach(visit => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${visit.vehiculo || 'No disponible'}</td>
                <td>${new Date(visit.fecha).toLocaleString()}</td>
                <td>${visit.estado}</td>
                <td>
                    <button class="btn btn-danger cancel-visit" data-id="${visit.id}">Cancelar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones
        document.querySelectorAll('.cancel-visit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const visitId = e.target.getAttribute('data-id');
                if (confirm('¿Está seguro de cancelar esta visita?')) {
                    try {
                        // Implementar cancelación de visita
                        showNotification('Visita cancelada exitosamente');
                        loadUserVisits();
                    } catch (error) {
                        showNotification('Error al cancelar visita', 'error');
                    }
                }
            });
        });
        
    } catch (error) {
        console.error('Error al cargar visitas:', error);
        container.innerHTML = '<p class="error">Error al cargar visitas</p>';
    }
}

// Cargar compras del usuario
async function loadUserPurchases() {
    const container = document.getElementById('myPurchasesContainer');
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Cargando compras...</p>';
    
    try {
        // Obtener el ID del usuario del localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            container.innerHTML = '<p class="error">No se pudo identificar al usuario</p>';
            return;
        }
        
        // Corregir la URL para obtener las compras del usuario
        const response = await fetch(`${API_URLS.compras}/compras/usuario/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener compras');
        }
        
        const data = await response.json();
        const purchases = data.data || [];
        
        if (purchases.length === 0) {
            container.innerHTML = '<p class="empty">No tienes compras registradas</p>';
            return;
        }
        
        // Mostrar las compras
        container.innerHTML = '';
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Vehículo</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody id="purchasesTableBody"></tbody>
            </table>
        `;
        
        const tableBody = document.getElementById('purchasesTableBody');
        
        purchases.forEach(purchase => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${purchase.vehiculo || 'No disponible'}</td>
                <td>${new Date(purchase.fecha).toLocaleString()}</td>
                <td>$${purchase.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>${purchase.estado}</td>
            `;
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error al cargar compras:', error);
        container.innerHTML = '<p class="error">Error al cargar compras</p>';
    }
}

// Cargar vehículos disponibles para visitas
async function loadAvailableVehicles() {
    const select = document.getElementById('vehicleId');
    if (!select) return;
    
    select.innerHTML = '<option value="">Cargando vehículos...</option>';
    
    try {
        const response = await fetch(`${API_URLS.vehiculos}/vehiculos?estado=disponible`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener vehículos');
        }
        
        const data = await response.json();
        const vehicles = data.data || [];
        
        if (vehicles.length === 0) {
            select.innerHTML = '<option value="">No hay vehículos disponibles</option>';
            return;
        }
        
        select.innerHTML = '<option value="">Seleccione un vehículo</option>';
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.marca} ${vehicle.modelo} (${vehicle.año})`;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error al cargar vehículos disponibles:', error);
        select.innerHTML = '<option value="">Error al cargar vehículos</option>';
    }
}

// Mostrar sección
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
    
    // Actualizar navegación
    document.querySelectorAll('.sidebar ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.sidebar ul li a[href="#${sectionId}"]`);
    if (activeItem) {
        activeItem.parentElement.classList.add('active');
    }
    
    // Cargar datos adicionales según la sección
    if (sectionId === 'programar-visita') {
        loadAvailableVehicles();
    }
}

// Mostrar/ocultar modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para ocultar modales
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para mostrar modales
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    // Implementar sistema de notificaciones
    alert(message);
}

// Función para mostrar el modal de recuperación de contraseña
function showForgotPasswordModal() {
    showModal('forgotPasswordModal');
}

// Exportar funciones para uso global
window.showForgotPasswordModal = showForgotPasswordModal;
window.hideModal = hideModal;