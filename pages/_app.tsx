import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
// import { applyMiddleware, compose, createStore } from 'redux';
// import thunk from 'redux-thunk';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'styles/theme';
// import { rootReducer } from 'client/store/reducers';
import PageLayout from 'client/components/PageLayout';

// const composeEnhancers =
//   (typeof window !== 'undefined' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
//   compose;

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk)),
// );

import withRedux from 'next-redux-wrapper';

import { PersistGate } from 'redux-persist/integration/react';
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
