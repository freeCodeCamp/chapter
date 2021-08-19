import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { ChakraProvider } from '@chakra-ui/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import { ConfirmContextProvider } from 'chakra-confirm';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import PageLayout from '../components/PageLayout';
import { AuthContextProvider } from '../modules/auth/store';
import theme from '../styles/theme';

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
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ApolloProvider client={client}>
        <MaterialUIThemeProvider theme={theme}>
          <CssBaseline />
          <ChakraProvider>
            <AuthContextProvider>
              <ConfirmContextProvider>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </ConfirmContextProvider>
            </AuthContextProvider>
          </ChakraProvider>
        </MaterialUIThemeProvider>
      </ApolloProvider>
    </>
  );
};

export default CustomApp;
