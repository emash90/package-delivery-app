FROM node:14-alpine3.14

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .