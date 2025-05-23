# SALECAR-Proyecto-Final-Redes-2025

**Análisis y visualización de datos del mercado automotor de Emiratos Árabes mediante microservicios y procesamiento distribuido.**

---

## 🚗 Descripción del Proyecto

Sale Cars es una plataforma web que utiliza un dataset público de vehículos usados de Emiratos Árabes Unidos para análisis y visualización de datos a gran escala mediante Apache Spark y Metabase. Además, permite a los usuarios registrar sus propios vehículos para la venta, explorar los autos disponibles en la plataforma y realizar procesos de compra mediante agendamiento de citas y simulaciones. La arquitectura está basada en microservicios desarrollados en Node.js para backend y React.js en el frontend, integrando funcionalidades tanto analíticas como transaccionales.

---

## 🧩 Arquitectura del Sistema

### 🔹 Microservicios Web
- **Usuarios:** Registro, login, gestión de perfiles (Node.js + Express + JWT).
- **Vehículos:** CRUD de anuncios de autos.
- **Compras:** Agendamiento y simulación de compra.
- **Frontend:** React.js + Tailwind CSS + React Router.

### 🔹 Sistema de Análisis Distribuido
- **Apache Spark Cluster (Dockerizado):** Procesamiento en paralelo.
- **PySpark Runner:** Pipeline ETL y consultas SQL.
- **Base de Datos:** MySQL 8.0 (contenedorizada).
- **Metabase:** Dashboards incrustados en el frontend vía iframes.

---

## 📊 Dataset Utilizado

**Fuente:** [UAE Used Car Prices - Kaggle](https://www.kaggle.com/datasets/alikalwar/uae-used-car-prices-and-features-10k-listings)

**Tamaño:** 10,000+ registros

**Variables principales:** `make`, `model`, `year`, `mileage`, `price`, `fuel_type`, `transmission`, `color`, `engine_size`, `cylinders`.

---

## ⚙️ Tecnologías

- **Backend:** Node.js, Express, bcrypt, JWT, mysql2  
- **Frontend:** React.js, Tailwind CSS  
- **Base de datos:** MySQL  
- **Procesamiento:** Apache Spark + PySpark  
- **Visualización:** Metabase  
- **Orquestación:** Docker Swarm  
- **Pruebas de carga:** Apache JMeter  

---

## 🚀 Despliegue

1. Clonar el repositorio.  
2. Construir imágenes por microservicio:  
   ```bash
   docker build -t mariavalencia30/salescarsv2-usuarios backend/usuarios_src
   docker push mariavalencia30/salescarsv2-usuarios
   # Repetir para cada microservicio y componente

3.Iniciar Docker Swarm:
docker swarm init --advertise-addr <IP_manager>

4.Desplegar stack:
docker stack deploy -c docker-compose.yml salescarsv2

🔐 Credenciales de Acceso al Panel de Administrador

Email: admisalecars@car.com
Nombre: Maria V
Teléfono: 123456789
Contraseña: thebestcars

📊 Acceso a Métricas y Paneles de Administración

Estadísticas de HAProxy:
http://192.168.119.138:8404/haproxy_stats (ajustar según IP utilizada)
Interfaz de Apache Spark (Web UI):
http://192.168.119.138:8081/ (ajustar según IP utilizada)

📁 Ruta de Trabajo del Proyecto en Servidor

El proyecto debe estar ubicado en:
/var/www/html/SalesCarsV2

📁 Estructura y Ubicación de Archivos

Para un funcionamiento correcto del sistema en producción con Docker Swarm:

Todos los archivos del proyecto (backend, frontend, pyspark, Metabase, Dockerfiles y docker-compose.yml) deben estar presentes en el nodo manager (servidorUbuntu) en la ruta:
/var/www/html/SalesCarsV2
El nodo worker (clienteUbuntu) no requiere tener el código fuente, solo debe estar unido al clúster Swarm.

🔄 Unión de nodos al clúster
Desde el nodo manager:
docker swarm init --advertise-addr <IP_manager>
Desde el nodo worker:
docker swarm join --token <token> <IP_manager>:2377

🐳 Despliegue del sistema

Desde el nodo manager, en la ruta del proyecto:
cd /var/www/html/SalesCarsV2
docker stack deploy -c docker-compose.yml salescarsv2


