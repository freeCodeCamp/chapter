module.exports = {
  schema: [{ 'http://localhost:5000/graphql': {} }],
  documents: ['./src/**/graphql/*.ts'],
  overwrite: true,
  generates: {
    './src/generated/index.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        apolloReactCommonImportFrom: '@apollo/client',
        apolloReactComponentsImportFrom: '@apollo/client',
        apolloReactHocImportFrom: '@apollo/client',
        apolloReactHooksImportFrom: '@apollo/client',
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};
