import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol,
  li,
  p,
  pre,
  blockquote,
  figure,
  hr {
    margin: 0;
    padding: 0;
  }

  input,
  textarea,
  select,
  button {
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
  }

  embed,
  iframe,
  img,
  object,
  video {
    display: block;
    max-width: 100%;
  }
`;
