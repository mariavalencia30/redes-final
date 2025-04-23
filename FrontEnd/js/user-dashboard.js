import { API_URLS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        window.location.href = '/index.html';
        return;
    }

    loadUserProfile(userData.id);
    populateVehicleOptions();
  
    loadUserVehicles(userData.id);
    loadUserPurchases(userData.id);
    loadUserVisits(userData.id);
    setupVehicleForm();
    
    setupEventListeners();
    // justo después de setupEventListeners();
setupNavigation();

function setupNavigation() {
  const sections = document.querySelectorAll('.dashboard-section');
  const links    = document.querySelectorAll('.sidebar a');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);  // e.g. "mis-compras"
      showSection(targetId);
    });
  });

  // muestra por defecto “Mis Vehículos”
  showSection('mis-vehiculos');
}


  

async function loadUserVisits(userId) {
    try {
        const response = await fetch(`${API_URLS.compras}/compras/visitas/user/${userId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const visits = await response.json();
        const container = document.getElementById('myVisitsContainer');

        if (visits.length === 0) {
            container.innerHTML = '<p>No tienes visitas programadas.</p>';
            return;
        }

        container.innerHTML = visits.map(v => `
            <div class="visit-card">
                <h3>Vehículo ${v.vehicle_id}</h3>
                <p>Fecha de visita: ${new Date(v.fecha).toLocaleDateString()}</p>
                <p>Asistió: ${v.asistio ? 'Sí' : 'No'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar mis visitas:', error);
        showError('Error al cargar mis visitas');
    }
}


// Añadir estas funciones al archivo
function setupVehicleForm() {
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) return;

            const formData = {
                marca: document.getElementById('marca').value,
                modelo: document.getElementById('modelo').value,
                año: document.getElementById('año').value,
                precio: document.getElementById('precio').value,
                kilometraje: document.getElementById('kilometraje').value
            };

            try {
                const response = await fetch(`${API_URLS.vehiculos}/vehiculos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Vehículo registrado exitosamente');
                    vehicleForm.reset();
                    loadUserVehicles(userData.id); // Si es necesario recargar la lista
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al registrar el vehículo');
            }
        });
    }
}



function showSection(id) {
  document.querySelectorAll('.dashboard-section').forEach(sec => {
    sec.classList.toggle('hidden', sec.id !== id);
  });
}


    document.getElementById('userWelcome').textContent += userData.nombre;
});

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('visitForm').addEventListener('submit', handleVisitRegistration);
    
}

async function loadUserProfile(userId) {
    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios/${userId}`);
        const user = await response.json();

        document.getElementById('profileName').value = user.nombre;
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = user.telefono;
    } catch (error) {
        showError('Error al cargar el perfil');
    }
}

async function handleLogout() {
    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            sessionStorage.removeItem('userData');
            window.location.href = '/index.html';
        }
    } catch (error) {
        showError('Error al cerrar sesión');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value;

    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Instrucciones enviadas a tu correo');
            
        }
    } catch (error) {
        showError('Error al procesar la solicitud');
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('userData')); // Cambiado a localStorage
    const newPassword = document.getElementById('newPassword').value;

    // Parte de actualización de contraseña
    if (newPassword) {
        try {
            const response = await fetch(`${API_URLS.usuarios}/usuarios/password-change`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: userData.id,
                    nuevaContrasena: newPassword
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Error del servidor");
            }

            alert('Contraseña actualizada correctamente');
            document.getElementById('newPassword').value = ''; // Limpiar campo

        } catch (error) {
            console.error('Error:', error);
            showNotification(`Error: ${error.message}`, 'error');
        }
    }

    const updatedData = {
        email: document.getElementById('profileEmail').value,
        nombre: document.getElementById('profileName').value,
        telefono: document.getElementById('profilePhone').value
    };

    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios/${userData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('Perfil actualizado correctamente');
        }
    } catch (error) {
        showError('Error al actualizar perfil');
    }
}

async function handleVisitRegistration(e) {
    e.preventDefault();
    
    const userData    = JSON.parse(localStorage.getItem('userData'));
    const vehicleId   = document.getElementById('vehicleId').value;
    const visitDate   = document.getElementById('visitDate').value;   
  
    if (!vehicleId || !visitDate) {
      return showError('visitError', 'Debes seleccionar vehículo y fecha.');
    }
  
    try {
      const payload = {
        userId:    userData.id,
        vehicleId: +vehicleId,
        fecha:     visitDate + ' 00:00:00',  
        asistio:   true
      };
  
      const response = await fetch(`${API_URLS.compras}/compras/visitas`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || response.statusText);
      }
  
      alert('Visita programada y marcada como asistida');
      
     
  
    } catch (error) {
      console.error('Error al programar visita:', error);
      showError('visitError', error.message || 'No se pudo programar la visita');
    }
  }

  async function populateVehicleOptions() {
    try {
      const response = await fetch(`${API_URLS.vehiculos}/vehiculos`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const vehicles = await response.json();
      const select = document.getElementById('vehicleId');
      select.innerHTML = '<option value="">Seleccione un vehículo</option>'; // opción por defecto
  
      vehicles.data.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = `${v.marca} ${v.modelo}`;
        select.appendChild(opt);
      });
    } catch (err) {
      console.error('Error cargando vehículos:', err);
      
    }
  }
  
  



async function loadUserPurchases(userId) {
    try {
        const response = await fetch(`${API_URLS.compras}/compras/user/${userId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const purchases = await response.json();
        const container = document.getElementById('myPurchasesContainer');

        console.log('Mis compras:', purchases);  // Agrega este log para verificar el objet

        // Renderizar cada compra
        container.innerHTML = purchases.map(p => `
            <div class="purchase-card">
                <h3>Vehículo ${p.vehicle_id}:</h3>
                <p>Fecha de compra: ${new Date(p.fecha).toLocaleDateString()}</p>
                <p>Total pagado: $${p.precio_total.toLocaleString()}</p>
                <p>Método de pago: ${p.metodo_pago}</p>
                <p>Estado: ${p.estado}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar mis compras:', error);
        showError('Error al cargar mis compras');
    }
}


async function loadVisits(userId) {
    try {
        const response = await fetch(`${API_URLS.visitas}/compras/visitas`);
        const allVisits = await response.json();
        const userVisits = allVisits.filter(visit => visit.user_id == userId);
        const container = document.getElementById('myVisitsContainer');

        container.innerHTML = userVisits.map(visit => `
            <div class="visit-card">
                <h3>${visit.vehicle_id}</h3>
                <p>Fecha: ${new Date(visit.fecha).toLocaleDateString()}</p>
                <p>Asistió: ${visit.asistio ? 'Sí' : 'No'}</p>
            </div>
        `).join('');
    } catch (error) {
        showError('Error al cargar visitas');
    }
}

async function loadUserVehicles(userId) {
    try {
        // Usar el endpoint que mencionaste en tu código
        const response = await fetch(`${API_URLS.compras}/compras/vehiculos/user/${userId}`);
        const vehiclesData = await response.json();
        const container = document.getElementById('myVehiclesContainer');

        // Verificar si hay vehículos
        if (vehiclesData.length === 0) {
            container.innerHTML = '<p>No tienes vehículos registrados.</p>';
            return;
        }

        // Crear las tarjetas de vehículos
        container.innerHTML = vehiclesData.map(item => `
            <div class="vehicle-card">
                <h3>${item.marca} ${item.modelo}</h3>
                <p>Año: ${item.anio || item.año}</p>
                <p>Precio: $${item.precio_total || item.precio}</p>
                <p>Fecha de compra: ${new Date(item.fecha).toLocaleDateString()}</p>
                ${item.imagen ? `<img src="${item.imagen}" alt="${item.marca} ${item.modelo}">` : ''}
            </div>
        `).join('');
    } catch (error) {
        
    }
}

async function handleAccountDeletion() {
    const confirmacion = confirm('¿Estás seguro de eliminar tu cuenta?');
    if (!confirmacion) return;

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    try {
        const response = await fetch(`${API_URLS.usuarios}/usuarios/${userData.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            sessionStorage.removeItem('userData');
            window.location.href = '/index.html';
        }
    } catch (error) {
        showError('Error al eliminar cuenta');
    }
}




