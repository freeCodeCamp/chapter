import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { ChakraProvider } from '@chakra-ui/react';

import theme from '../styles/theme';
import PageLayout from '../components/PageLayout';
import { ConfirmContextProvider } from 'chakra-confirm';

const serverUri =
  process.env.NEXT_PUBLIC_APOLLO_SERVER || 'http://localhost:5000';

const client = new ApolloClient({
  uri: `${serverUri}/graphql`,
  cache: new InMemoryCache(),
});

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
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
              <ConfirmContextProvider>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </ConfirmContextProvider>
            </ChakraProvider>
          </MaterialUIThemeProvider>
        </ApolloProvider>
      </>
    );
  }
}
