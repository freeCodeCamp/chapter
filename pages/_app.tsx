import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRedux from 'next-redux-wrapper';
import { PersistGate } from 'redux-persist/integration/react';

import theme from 'styles/theme';
import PageLayout from 'client/components/PageLayout';
import reduxStore from '../lib/redux';

class MyApp extends App<any> {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <>
        <Head>
          <title>Chapter</title>
        </Head>
        <Provider store={store}>
          <PersistGate persistor={store.__PERSISTOR} loading={null}>
            <MaterialUIThemeProvider theme={theme}>
              <CssBaseline />
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </MaterialUIThemeProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }
}

export default withRedux(reduxStore)(MyApp);
