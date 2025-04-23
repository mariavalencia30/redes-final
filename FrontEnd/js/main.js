import { api } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    setupScrollEffects();
});

// Inicialización de la UI
function initializeUI() {
    // Manejar el menú móvil
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.querySelector('.main-nav');
    
    menuBtn?.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // Cambiar el fondo del header al hacer scroll
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Efectos de scroll
function setupScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Implementar lógica de notificaciones aquí
    alert(message);
}

// Actualizar UI según estado de autenticación
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');

    if (token) {
        authButtons?.classList.add('hidden');
        userMenu?.classList.remove('hidden');
    } else {
        authButtons?.classList.remove('hidden');
        userMenu?.classList.add('hidden');
    }
} 