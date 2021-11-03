FROM node:16-alpine

WORKDIR /usr/chapter/server

# Bundle app source
COPY . .

# Install app dependencies
RUN npm i -g npm@8 && npm i

EXPOSE 5000

CMD [ "npm","run","dev" ]

