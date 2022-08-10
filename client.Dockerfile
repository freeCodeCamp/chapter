FROM node:16-alpine as development
WORKDIR /usr/chapter/

FROM development as build

ARG NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_USE_AUTH0=true
ARG NEXT_PUBLIC_AUTH0_DOMAIN
ARG NEXT_PUBLIC_AUTH0_CLIENT_ID
ARG NEXT_PUBLIC_AUTH0_AUDIENCE
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_CLIENT_URL

COPY client ./client
COPY common ./common
COPY package*.json ./

RUN npm ci -w=client --ignore-scripts
RUN npm run build:client

FROM development as production

COPY --from=build /usr/chapter/client/.next ./client/.next
COPY client/public ./client/public
COPY package*.json ./
COPY client/package.json ./client/package.json

RUN npm ci -w=client --ignore-scripts --omit=dev 

EXPOSE 3000

WORKDIR /usr/chapter/client

CMD [ "npm", "run", "start" ]

