import { API_URLS } from './config.js';

class VehiclesAPI {
    constructor() {
        this.baseUrl = API_URLS.vehiculos;
    }

    
    async getAllVehicles() {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos`); // URL base directa
            if (!response.ok) throw new Error('Error en la API');
            const data = await response.json();
            
            // Validar estructura de respuesta
            if (!data.success || !Array.isArray(data.data)) {
                throw new Error('Formato de respuesta inválido');
            }
            
            return data;
        } catch (error) {
            console.error('Error en getAllVehicles:', error);
            throw error;
        }
    }

    // Obtener un vehículo por ID
    async getVehicleById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el vehículo');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Buscar vehículos con filtros
    async searchVehicles(filters) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/buscar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filters)
            });
            if (!response.ok) {
                throw new Error('Error al buscar vehículos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener todas las marcas
    async getBrands() {
        try { 
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas`);
            if (!response.ok) {
                throw new Error('Error al obtener las marcas');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener modelos por marca
    async getModelsByBrand(brand) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas/${brand}/modelos`);
            if (!response.ok) {
                throw new Error('Error al obtener los modelos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener vehículos destacados (primeros 3)
    async getFeaturedVehicles() {
        try {
            // Conserva el límite de 3 para destacados
            const response = await fetch(`${this.baseUrl}/vehiculos?limit=3`);
            if (!response.ok) throw new Error('Error al obtener destacados');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Obtener años disponibles por marca y modelo
    async getYearsByBrandAndModel(brand, model) {
        try {
            const response = await fetch(`${this.baseUrl}/vehiculos/marcas/${brand}/modelos/${model}/años`);
            if (!response.ok) {
                throw new Error('Error al obtener los años');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

// Clase para manejar la interfaz de usuario de vehículos
class VehiclesUI {
    constructor() {
        this.api = new VehiclesAPI();
        this.initializeEventListeners();
        this.loadBrands();
        this.loadFeaturedVehicles();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Evento para el filtro de marca
        const marcaFilter = document.getElementById('marcaFilter');
        if (marcaFilter) {
            marcaFilter.addEventListener('change', () => this.handleBrandChange());
        }

        // Evento para el filtro de modelo
        const modeloFilter = document.getElementById('modeloFilter');
        if (modeloFilter) {
            modeloFilter.addEventListener('change', () => this.handleModelChange());
        }

        // Evento para el botón de búsqueda
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        
            const exploreBtn = document.getElementById('exploreBtn');
            console.log('¿Se encontró el botón explorar?', exploreBtn); // Log 1
        
            if (exploreBtn) {
                exploreBtn.addEventListener('click', e => {
                    e.preventDefault();
                    console.log('Botón explorar clickeado'); // Log 2
                    this.handleExplore();
                });
            } else {
                console.warn('El botón explorar NO se encontró'); // Log 3
            }
    
    }

    // Cargar marcas en el select
    async loadBrands() {
        try {
            const response = await this.api.getBrands();
            const marcaFilter = document.getElementById('marcaFilter');
            
            if (marcaFilter) {
                marcaFilter.innerHTML = '<option value="">Marca</option>';
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach(brand => {
                        const option = document.createElement('option');
                        option.value = brand;
                        option.textContent = brand;
                        marcaFilter.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            alert('Error al cargar las marcas. Por favor, recarga la página.');
        }
    }

    // Manejar cambio de marca
    async handleBrandChange() {
        const marcaFilter = document.getElementById('marcaFilter');
        const modeloFilter = document.getElementById('modeloFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (marcaFilter && modeloFilter && yearFilter) {
            const selectedBrand = marcaFilter.value;
            
            // Resetear modelos y años
            modeloFilter.innerHTML = '<option value="">Modelo</option>';
            yearFilter.innerHTML = '<option value="">Año</option>';
            
            if (selectedBrand) {
                try {
                    const response = await this.api.getModelsByBrand(selectedBrand);
                    if (response.data && Array.isArray(response.data)) {
                        response.data.forEach(model => {
                            const option = document.createElement('option');
                            option.value = model;
                            option.textContent = model;
                            modeloFilter.appendChild(option);
                        });
                    } else {
                        modeloFilter.innerHTML = '<option value="">No hay modelos disponibles</option>';
                    }
                } catch (error) {
                    console.error('Error al cargar modelos:', error);
                    modeloFilter.innerHTML = '<option value="">Error al cargar modelos</option>';
                }
            }
        }
    }

    // Manejar cambio de modelo
    async handleModelChange() {
        const marcaFilter = document.getElementById('marcaFilter');
        const modeloFilter = document.getElementById('modeloFilter');
        const yearFilter = document.getElementById('yearFilter');
        
        if (marcaFilter && modeloFilter && yearFilter) {
            const selectedBrand = marcaFilter.value;
            const selectedModel = modeloFilter.value;
            
            // Resetear años
            yearFilter.innerHTML = '<option value="">Año</option>';
            
            if (selectedBrand && selectedModel) {
                try {
                    const response = await this.api.getYearsByBrandAndModel(selectedBrand, selectedModel);
                    if (response.success && response.data.length > 0) {
                        response.data.forEach(year => {
                            const option = document.createElement('option');
                            option.value = year;
                            option.textContent = year;
                            yearFilter.appendChild(option);
                        });
                    } else {
                        yearFilter.innerHTML = '<option value="">No hay años disponibles</option>';
                    }
                } catch (error) {
                    console.error('Error al cargar años:', error);
                    yearFilter.innerHTML = '<option value="">Error al cargar años</option>';
                }
            }
        }
    }

    // Manejar búsqueda
    async handleSearch() {
        const id = document.getElementById('idFilter').value.trim();
    
        if (id) {
            try {
                const response = await this.api.getVehicleById(id);
                if (response.success) {
                    this.displayResults([response.data]); // Mostrar solo ese
                    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error al buscar por ID:', error);
                alert('No se encontró un vehículo con ese ID.');
            }
            return; // Evita seguir al buscar por otros filtros
        }
    
        // Si no hay ID, buscar por filtros
        const filters = {
            marca: document.getElementById('marcaFilter').value,
            modelo: document.getElementById('modeloFilter').value,
            año: document.getElementById('yearFilter').value,
            precio_min: document.getElementById('minPrice').value,
            precio_max: document.getElementById('maxPrice').value,
            kilometraje: document.getElementById('kilometraje').value
        };
    
        if (!filters.marca && !filters.modelo && !filters.año && !filters.precio_min && !filters.precio_max && !filters.kilometraje) {
            alert('Por favor, selecciona al menos un criterio de búsqueda');
            return;
        }
    
        try {
            const response = await this.api.searchVehicles(filters);
            if (response.success) {
                this.displayResults(response.data);
                document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error al buscar vehículos:', error);
            alert('Error al realizar la búsqueda. Por favor, intenta nuevamente.');
        }
    }
    

    // Método displayResults corregido
displayResults(vehiclesData) {
    const resultsContainer = document.querySelector('#resultados .models-grid');
    if (!resultsContainer) {
        console.error('Contenedor de resultados no encontrado');
        return;
    }

    resultsContainer.innerHTML = '';

    if (!vehiclesData?.length) {
        resultsContainer.innerHTML = `
            <p class="no-results">
                <i class="fas fa-car-crash"></i>
                No se encontraron vehículos
            </p>
        `;
        return;
    }

    vehiclesData.forEach(vehicle => {
        const cardHtml = this.createVehicleCard(vehicle);
        const cardElement = this.createCardFromHtml(cardHtml);
        resultsContainer.appendChild(cardElement);
    });
}

// Función auxiliar para convertir HTML a DOM
createCardFromHtml(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

    // Crear tarjeta de vehículo
    createVehicleCard(vehicle) {
        // Convertir a números
        const precio = Number(vehicle.precio);
        const kilometraje = Number(vehicle.kilometraje);
        
        return `
            <div class="vehicle-card">
                <div class="vehicle-image">
                    <img src="assets/vehicles/${vehicle.marca.toLowerCase()}_${vehicle.modelo.toLowerCase()}.jpg" 
                         alt="${vehicle.marca} ${vehicle.modelo}">
                </div>
                <div class="vehicle-info">
                    <h3>${vehicle.marca} ${vehicle.modelo}</h3>
                    <p>Año: ${vehicle.año}</p>
                    <p>Precio: $${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    <p>Kilometraje: ${kilometraje.toLocaleString('es-MX')} km</p>
                    <div class="vehicle-status ${vehicle.estado}">
                        ${vehicle.estado.toUpperCase()}
                    </div>
                    <button class="view-details" data-id="${vehicle.id}">
                        <i class="fas fa-search"></i> Detalles
                    </button>
                </div>
            </div>
        `;
    }

    // Mostrar detalles del vehículo
    async showVehicleDetails(id) {
        try {
            const response = await this.api.getVehicleById(id);
            if (response.success) {
                // Aquí puedes implementar la lógica para mostrar los detalles
                console.log('Detalles del vehículo:', response.data);
                // Por ejemplo, abrir un modal con los detalles
            }
        } catch (error) {
            console.error('Error al obtener detalles del vehículo:', error);
        }
    }

    // Cargar vehículos destacados
    async loadFeaturedVehicles() {
        try {
            const response = await this.api.getFeaturedVehicles();
            if (response.success) {
                this.displayFeaturedVehicles(response.data);
            }
        } catch (error) {
            console.error('Error al cargar vehículos destacados:', error);
        }
    }

    // Mostrar vehículos destacados
    displayFeaturedVehicles(vehicles) {
        const featuredContainer = document.querySelector('.featured-models .models-grid');
        if (featuredContainer) {
            featuredContainer.innerHTML = '';
            
            // Limitar a 3 vehículos
            const limitedVehicles = vehicles.slice(0, 3);
            
            limitedVehicles.forEach(vehicle => {
                featuredContainer.insertAdjacentHTML('beforeend', this.createVehicleCard(vehicle));
              });
        }
    }

    // En VehiclesUI.handleExplore()
    async handleExplore() {
        try {
            const response = await this.api.getAllVehicles();
            
            if (response.success && response.data) {
                // Mostrar todos los vehículos sin filtros
                this.displayResults(response.data); 
                
                // Desplazarse a la sección de resultados
                document.getElementById('resultados').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                
                document.getElementById('marcaFilter').value = '';
                document.getElementById('modeloFilter').value = '';
                document.getElementById('yearFilter').value = '';
            } else {
                this.displayResults([]);
                console.warn('No hay vehículos disponibles');
            }
        } catch (error) {
            console.error('Error al cargar vehículos:', error);
            this.displayResults([]);
            alert('Error al cargar todos los vehículos');
        }
    }
}

// Inicializar la interfaz cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Se hizo clic en Explorar");
    new VehiclesUI();
}); 