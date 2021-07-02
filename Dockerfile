FROM node:14-alpine

WORKDIR /usr/chapter/

# Bundle app source
COPY . .

# Install app dependencies
RUN npm i -g npm@7 && npm i

EXPOSE 5000

CMD [ "npm","run","dev" ]

