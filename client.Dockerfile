FROM node:16-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/chapter/

# Copying source files
COPY client ./client
COPY common ./common
COPY package*.json ./

# Installing dependencies
RUN npm ci -w=client --ignore-scripts

# Building app
RUN npm run build:client

EXPOSE 3000

# Running the app
CMD [ "npm", "run", "start" ]

