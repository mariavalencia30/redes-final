# Usar la imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que corre el servidor
EXPOSE 3006
# Copy wait-for-it script to the container
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD /wait-for-it.sh db:3306 -- node index.js
# Comando para ejecutar el servidor
#CMD ["node", "index.js"]
