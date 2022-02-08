FROM node:16-alpine

WORKDIR /usr/chapter/

# Bundle app source
COPY ./server ./server
COPY package*.json ./

# Install app dependencies
RUN npm ci -w=server --ignore-scripts

EXPOSE 5000

WORKDIR /usr/chapter/server

CMD [ "npm","run","dev" ]

