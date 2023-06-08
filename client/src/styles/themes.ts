import { extendTheme } from '@chakra-ui/react';
import { buttonTheme } from './ButtonOutline';

const chapterStyleVariables = {
  colors: {
    gray: {
      '00': '#ffffff',
      '05': '#f5f6f7',
      '10': '#dfdfe2',
      '15': '#d0d0d5',
      '45': '#858591',
      '75': '#3b3b4f',
      '80': '#2a2a40',
      '85': '#1b1b32',
      '90': '#0a0a23',
    },
    yellow: {
      gold: '#ffbf00',
      light: '#ffc300',
      dark: '#4d3800',
    },
  },
};

export const chapterTheme = extendTheme(chapterStyleVariables, {
  components: { Button: buttonTheme },
});
