FROM node:14.17.0-alpine3.13

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g npm@9.7.2

COPY . .
