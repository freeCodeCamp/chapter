FROM node:14-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/chapter/client

# Copying source files
COPY . .

# Installing dependencies
RUN npm i -g npm@7 && npm i

# Building app
RUN npm run build

EXPOSE 3000

# Running the app
CMD [ "npm", "run", "start" ]

