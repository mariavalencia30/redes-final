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

        if (response.ok) {
            // Guardar token y datos de usuario
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                name: data.nombre,
                role: data.role
            }));
            
            // Redirigir automáticamente según el rol
            if (data.role === 'admin') {
                window.location.href = 'views/admin-dashboard.html';
            } else {
                console.log("Dato importamte: ", data.role);
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

    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const telefono = document.getElementById('registerPhone').value;
    const contrasena = document.getElementById('registerPassword').value;

    try {
        console.log('Registrando usuario...');
        const response = await fetch(`${API_URLS.usuarios}/usuarios/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                telefono,
                contrasena,
            })
        });

        const data = await response.json();

        if (response.ok) {
            hideModal(document.getElementById('registerModal'));
            showModal(document.getElementById('loginModal'));
            clearForms();
        } else {
            showError('registerError', data.message || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showError('registerError', 'Error al conectar con el servidor');
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
    if (userJson) {
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