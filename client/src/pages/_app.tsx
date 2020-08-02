import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import theme from '../styles/theme';
import { rootReducer } from '../store/reducers';
import PageLayout from '../components/PageLayout';

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
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
          <Provider store={store}>
            <MaterialUIThemeProvider theme={theme}>
              <CssBaseline />
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </MaterialUIThemeProvider>
          </Provider>
        </ApolloProvider>
      </>
    );
  }
}
