# Server side technical documentation

## Database

for any problems ping @Zeko369

We're using Postgres for our database and TypeORM for our ORM (mapping database tables to js objects). Here are a few examples on how to use our TypeORM setup.

To make it since the port from docker postgres service is exposed to the host (54320) you dont have to run `docker-compose exec...`, and can just run db commands from the host. This also makes it a lot easier to access the db from the ourside if you're running a local db on the system.

### Seed database

`npm run seed`

Development is easier with a database full of example entities. The process of creating example entities in the database is called seeding.

Use `npm run seed` to create these example entities.

### Create a new model / entity

`npm run typeorm entity:create -- --name=ModelName`

This would create `ModelName.ts` in `server/models`

To keep everything DRY, add `extends BaseModel` to the class and import it from 'server/models/BaseModel' to no repeat id, createdAt, and updatedAt fields on every single model

You could also run `npx typeorm` since here you're not actually loading any ts files, but because regular `npx typeorm` runs inside of node it import from `.ts` files, so we run it with `ts-node` and our custom server config (check package.json)

### Create a migration

After you created a new model or updated an existing one, you need to generate a migration for those changes. To do so run:

`npm run typeorm migration:generate -- --name=MigrationName`

Since this runs a compare agains the current db schema, you need to have the app running.

After that, check the generated SQL in `server/migrations/date-MigrationName.ts`

### Running migrations and checking if migrations were run

You can manualy run them by doing
`npm run typeorm migration:run`

and then check if it happened correctly

`npm run typeorm migration:show`

it should ouput something like

```
 [X] Chapter1574341690449
 ...
 [X] MigrationName1575633316367
```
