FROM mongo

EXPOSE 27017

# Copiamos el script de inicialización
COPY init.js /docker-entrypoint-initdb.d/init.js

# Configuramos el punto de entrada
CMD ["mongod"]