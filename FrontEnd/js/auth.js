import { API_URLS } from './config.js';

// Función para inicializar la autenticación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando autenticación...');
    initializeAuth();
});

function initializeAuth() {
    console.log('Verificando elementos del DOM...');
    // Elementos del DOM
    const elements = {
        loginModal: document.getElementById('loginModal'),
        registerModal: document.getElementById('registerModal'),
        loginBtn: document.getElementById('loginBtn'),
        registerBtn: document.getElementById('registerBtn'),
        showLoginLink: document.getElementById('showLogin'),
        showRegisterLink: document.getElementById('showRegister'),
        closeButtons: document.querySelectorAll('.close-modal'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        isAdminCheckbox: document.getElementById('isAdmin')
    };

    // Verificar si los elementos existen
    Object.entries(elements).forEach(([key, element]) => {
        if (!element && key !== 'closeButtons') {
            console.warn(`Elemento ${key} no encontrado en el DOM`);
        }
    });

    // Event Listeners para botones y enlaces
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => {
            console.log('Click en loginBtn');
            showModal(elements.loginModal);
        });
    }

    if (elements.registerBtn) {
        elements.registerBtn.addEventListener('click', () => {
            console.log('Click en registerBtn');
            showModal(elements.registerModal);
        });
    }

    if (elements.showLoginLink) {
        elements.showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(elements.registerModal);
            showModal(elements.loginModal);
        });
    }

    if (elements.showRegisterLink) {
        elements.showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(elements.loginModal);
            showModal(elements.registerModal);
        });
    }

    // Cerrar modales
    elements.closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(elements.loginModal);
            hideModal(elements.registerModal);
        });
    });

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) hideModal(elements.loginModal);
        if (e.target === elements.registerModal) hideModal(elements.registerModal);
    });

    // Manejar formularios
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }

    if (elements.registerForm) {
        elements.registerForm.addEventListener('submit', handleRegister);
    }

    // Verificar usuario logueado
    checkLoggedUser();
}

// Funciones para mostrar/ocultar modales
const showModal = (modal) => {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

const hideModal = (modal) => {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        clearErrors();
        clearForms();
    }
};

// Limpiar errores
const clearErrors = () => {
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
        error.classList.remove('visible');
    });
};

// Limpiar formularios
const clearForms = () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
};

// Mostrar errores
const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
};

// Validaciones
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
};

// Manejo del formulario de login
// Primero corrige la función handleLogin 
async function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    // Obtener valores de los campos de login
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('contrasena');

    try {
        console.log('Iniciando sesión...');
        const response = await fetch(`${API_URLS.usuarios}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value, contrasena: passwordInput.value })
        });

        const data = await response.json();
        
        console.log('Datos de respuesta:', data);

        if (response.ok) {
            // Guardar token y datos del usuario
            localStorage.setItem('token', data.token);
            
            // Asegúrate de que los nombres de campos sean consistentes
            localStorage.setItem('userData', JSON.stringify({
                id: data.id,
                nombre: data.nombre,
                email: emailInput.value,
                rol: data.role || data.rol // Manejar ambas posibilidades
            }));
            
            console.log("Rol del usuario:", data.role || data.rol);
            
            // Redirigir automáticamente según el rol
            if ((data.role || data.rol) === 'admin') {
                console.log("Redirigiendo a admin dashboard...");
                window.location.href = 'views/admin-dashboard.html';
            } else {
                console.log("Redirigiendo a user dashboard...");
                window.location.href = 'views/user-dashboard.html';
            }
        } else {
            showError('loginError', data.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showError('loginError', 'Error de conexión');
    }
}

// Manejo del formulario de registro
async function handleRegister(e) {
    e.preventDefault();
    clearErrors();
    console.log('Iniciando registro...');

    // Obtener elementos del formulario
    const nombreElement = document.getElementById('registerName');
    const emailElement = document.getElementById('registerEmail');
    const telefonoElement = document.getElementById('registerPhone');
    const passwordElement = document.getElementById('registerPassword');
    
    // Verificar si los elementos existen
    if (!nombreElement || !emailElement || !passwordElement) {
        console.error('Elementos del formulario no encontrados:', {
            nombre: !!nombreElement,
            email: !!emailElement,
            telefono: !!telefonoElement,
            password: !!passwordElement
        });
        showError('registerError', 'Error en el formulario. Por favor, recarga la página.');
        return;
    }
    
    // Obtener valores
    const nombre = nombreElement.value;
    const email = emailElement.value;
    const telefono = telefonoElement ? telefonoElement.value : '';
    const password = passwordElement.value;
    
    console.log('Valores del formulario:', { nombre, email, telefono, password: '***' });
    
    // Validaciones básicas
    if (!validateEmail(email)) {
        showError('registerError', 'Email inválido');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('registerError', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (telefono && !validatePhone(telefono)) {
        showError('registerError', 'Teléfono inválido (debe tener 10 dígitos)');
        return;
    }
    
    try {
        // Determinar el rol (usuario normal por defecto)
        const isAdmin = document.getElementById('isAdmin') && document.getElementById('isAdmin').checked;
        const rol = isAdmin ? 'admin' : 'user';
        
        // Crear objeto con los datos del usuario - EXACTAMENTE como en el CURL
        const userData = { 
            email: email,
            nombre: nombre,
            telefono: telefono,
            contrasena: password, // Cambiado de password a contrasena
            rol: rol
        };
        
        console.log('Datos a enviar:', userData);
        
        // Enviar solicitud al servidor
        const response = await fetch(`${API_URLS.usuarios}/usuarios/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        console.log('Respuesta del servidor:', response.status);
        const data = await response.json();
        console.log('Datos de respuesta:', data);
        
        if (response.ok) {
            showNotification('Usuario registrado exitosamente');
            hideModal(document.getElementById('registerModal'));
            showModal(document.getElementById('loginModal'));
        } else {
            showError('registerError', data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showError('registerError', 'Error de conexión');
    }
}

// Función para actualizar la UI cuando el usuario está logueado
function updateUIForLoggedUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    
    userMenu.innerHTML = `
        <span>Bienvenido, ${user.name}</span>
        ${user.role === 'admin' ? `<a href="views/admin-dashboard.html" class="btn-auth">Panel Admin</a>` : ''}
        <button id="logoutBtn" class="btn-auth">Cerrar Sesión</button>
    `;
    
    authButtons.innerHTML = '';
    authButtons.appendChild(userMenu);

    // Agregar evento para cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Función para manejar el cierre de sesión
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

// Verificar si hay un usuario logueado
function checkLoggedUser() {
    const userJson = localStorage.getItem('user');
    const adminJson = localStorage.getItem('admin');
    if (userJson || adminJson) {
        try {
            const user = JSON.parse(userJson);
            updateUIForLoggedUser(user);
    } catch (error) {
            console.error('Error al parsear datos del usuario:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Establecer tipo y mensaje
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}