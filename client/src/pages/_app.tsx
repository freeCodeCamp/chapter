import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmContextProvider } from 'chakra-confirm';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import PageLayout from '../components/PageLayout';
import { AuthContextProvider } from '../modules/auth/store';

const serverUri =
  process.env.NEXT_PUBLIC_APOLLO_SERVER || 'http://localhost:5000';

const httpLink = createHttpLink({ uri: `${serverUri}/graphql` });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          paginatedEvents: offsetLimitPagination(),
        },
      },
    },
  }),
});

const CustomApp: React.FC<AppProps> = ({ pageProps, Component }) => {
  return (
    <>
      <Head>
        <title>Chapter</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <ApolloProvider client={client}>
        <ChakraProvider>
          <AuthContextProvider>
            <ConfirmContextProvider>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </ConfirmContextProvider>
          </AuthContextProvider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
};

export default CustomApp;
