FROM node:20-alpine3.17

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g npm@9.7.2

COPY . .
