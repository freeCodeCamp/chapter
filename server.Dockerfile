FROM node:16-alpine
ARG build

WORKDIR /usr/chapter/

# Bundle app source
COPY server ./server
COPY common ./common
COPY package*.json ./

# Install app dependencies
# TODO: split this into stages
RUN npm ci -w=server --ignore-scripts --include-workspace-root

RUN if [ $build = true ]; then npm run build:server; fi

EXPOSE 5000

WORKDIR /usr/chapter/server

CMD [ "npm","run","dev" ]

