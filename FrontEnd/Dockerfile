# Usa una imagen base de NGINX
FROM nginx:alpine

# Copia todo el contenido de la carpeta local (frontend) al contenedor NGINX
COPY . /usr/share/nginx/html

# Expón el puerto 80 (el puerto por defecto de NGINX)
EXPOSE 80
# COMENTARIO AGREGADO PARA FORZAR RECONSTRUCCION (Puedes borrar esta línea después)
