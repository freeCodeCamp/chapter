import App from 'next/app';
import React from 'react';
import theme, { themeObject } from 'styles/theme';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <MaterialUIThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={themeObject}>
            <CssBaseline />
            <Component {...pageProps} />
          </StyledComponentsThemeProvider>
        </MaterialUIThemeProvider>
      </>
    );
  }
}
