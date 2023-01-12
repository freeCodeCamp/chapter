FROM node:18.13 as development
WORKDIR /usr/chapter/

FROM development as build

ARG NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT=production
ARG NEXT_PUBLIC_USE_AUTH0=true
ARG NEXT_PUBLIC_AUTH0_DOMAIN
ARG NEXT_PUBLIC_AUTH0_CLIENT_ID
ARG NEXT_PUBLIC_AUTH0_AUDIENCE
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_CLIENT_URL
# We need the dev dependencies to build the app, but this needs to be configurable
# so we can create test builds
ARG NODE_ENV=development

COPY client ./client
COPY common ./common
COPY package*.json ./

# Install dependencies (by default all dependencies, as long as NODE_ENV is not production)
RUN npm ci -w=client --ignore-scripts
RUN npm -w=client run build

FROM node:18-alpine3.17 as production
WORKDIR /usr/chapter/

COPY --from=build /usr/chapter/client/.next ./client/.next
COPY client/public ./client/public
COPY package*.json ./
COPY client/package.json ./client/package.json

RUN npm ci -w=client --ignore-scripts --omit=dev 

EXPOSE 3000

WORKDIR /usr/chapter/client

CMD [ "npm", "run", "start" ]

