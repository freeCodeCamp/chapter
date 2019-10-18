FROM node:10-alpine

WORKDIR /usr/chapter/

COPY . .

RUN npm install

EXPOSE 8000