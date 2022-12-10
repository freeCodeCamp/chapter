import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const outline = defineStyle({
  _focusVisible: {
    outlineColor: 'blue.600',
    outlineOffset: '1px',
    boxShadow: 'none',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { outline },
});
