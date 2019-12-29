import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const themeObject = {
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#1b1b32',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontSize: 16,
    h1: {
      fontSize: '2.375rem',
    },
    h2: {
      fontSize: '1.875rem',
    },
    h3: {
      fontSize: '1.375rem',
    },
    h4: {
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    caption: {
      fontSize: '0.625rem',
    },
  },
};
// Create a theme instance.
const theme = createMuiTheme(themeObject);

export default theme;
