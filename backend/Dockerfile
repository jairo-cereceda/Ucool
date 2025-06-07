# Usa Node oficial
FROM node:20

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia solo package.json y lock para instalar dependencias primero (mejor caché)
COPY package*.json ./

# Limpia node_modules por si acaso (útil si haces rebuilds desde cache)
RUN rm -rf node_modules

# Instala dependencias
RUN npm install

# Instala nodemon globalmente para hot-reload
RUN npm install -g nodemon

# Copia el resto del código (después de npm install para aprovechar cache)
COPY . .

# Evita conflictos si accidentalmente copias node_modules desde fuera
RUN rm -rf node_modules

# Reinstala de nuevo dentro (por seguridad si `.dockerignore` no está bien)
RUN npm install

# Expone el puerto (ajusta si tu backend usa otro)
EXPOSE 5000

# Comando por defecto: nodemon para hot reload
CMD ["npm", "run", "dev"]
