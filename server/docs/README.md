# Server side technical documentation

## Database

for any problems ping @Zeko369

We're using Postgres for our database and TypeORM for our ORM (mapping database tables to js objects). Here are a few examples on how to use our TypeORM setup.

To make it since the port from docker postgres service is exposed to the host (54320) you dont have to run `docker-compose exec...`, and can just run db commands from the host

### Create a new model / entity

`npm run typeorm entity:create -- --name=ModelName`

This would create `ModelName.ts` in `server/models`

You could also run `npx typeorm` since here you're not actually loading any ts files, but because regular `npx typeorm` runs inside of node it import from `.ts` files, so we run it with `ts-node` and our custom server config (check package.json)

### Create a migration

`npm run typeorm entity:create -- --name=ModelName`

`npm run typeorm migration:generate -- --name=MigrationName`

`npm run typeorm migration:show`
