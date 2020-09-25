FROM node:13-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/node

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

RUN npm install
