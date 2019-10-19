FROM node:10-alpine

WORKDIR /usr/chapter/

COPY package.json package-lock.json ./ 

RUN npm ci

COPY . .

EXPOSE 8000