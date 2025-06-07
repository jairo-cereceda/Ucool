# backend/Dockerfile

FROM node:20-alpine AS builder
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .

FROM node:20-alpine
WORKDIR /usr/src
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/ .

EXPOSE 5000

CMD [ "node", "index.js" ]