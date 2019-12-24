import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme, { themeObject } from 'styles/theme';
import { rootReducer } from 'client/store/reducers';
import PageLayout from 'client/components/PageLayout';

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <MaterialUIThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={themeObject}>
            <>
              <CssBaseline />
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </>
          </StyledComponentsThemeProvider>
        </MaterialUIThemeProvider>
      </Provider>
    );
  }
}
