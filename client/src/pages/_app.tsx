import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
  ServerError,
} from '@apollo/client';
import { NetworkError } from '@apollo/client/errors';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
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

const httpLink = createHttpLink({ uri: new URL('/graphql', serverUri).href });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ networkError }) => {
  if (isServerError(networkError)) {
    if (networkError.statusCode === 401) {
      localStorage.removeItem('token');
    }
    // TODO: do we want to implement some kind of refresh token instead of
    // forcing the user to log in again?
    if (networkError.result.message === 'Token expired') {
      window.location.href = '/auth/login';
    } else {
      window.location.reload();
    }
  }
});

function isServerError(err?: NetworkError): err is ServerError {
  return !(err == null) && 'result' in err && 'statusCode' in err;
}

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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
