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
};
// Create a theme instance.
const theme = createMuiTheme(themeObject);

export default theme;
