# Chapter frontend

## Running in dev server

```bash
yarn dev
```

## TODO: Remote setup

When we deploy a demo instance we'll be able to do the following and not need to run the backend locally

```bash
yarn dev:remote
```

## Graphql setup

Every `src/**/queries.ts` | `src/**/mutations.ts` will be inspected
by [graphqlcodegen](https://www.graphql-code-generator.com/)
and a query/mutation hook will be generated

1. Add new query
    ```ts
    export const exampleQuery = gql`
      query foobar {
        chapters {
          id
        }
      }
    `
    ```
2. Run codegen one time or continuously  
   one time

   ```bash
   yarn gen 
   ```

   or continuously

   ```
   yarn gen:dev
   ```

3. Import generated hook
   ```typescript
   const {loading, error, data} = useFoobarQuery()
   ```