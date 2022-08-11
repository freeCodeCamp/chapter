FROM node:16-alpine as development
WORKDIR /usr/chapter/

FROM development as build

# Bundle app source
COPY server ./server
COPY common ./common
COPY package*.json ./

RUN npm ci -w=server --ignore-scripts --include-workspace-root
RUN npm -w=server run build

FROM node:16-alpine as production
WORKDIR /usr/chapter/

COPY package*.json ./
COPY server/package.json ./server/package.json
RUN npm ci -w=server --ignore-scripts --include-workspace-root --omit=dev

COPY --from=build /usr/chapter/common ./common
COPY --from=build /usr/chapter/server/src ./server/src
COPY --from=build /usr/chapter/server/prisma ./server/prisma
COPY --from=build /usr/chapter/server/reminders ./server/reminders

RUN npx -w=server prisma generate

EXPOSE 5000

WORKDIR /usr/chapter/server

CMD [ "npm", "start" ]

