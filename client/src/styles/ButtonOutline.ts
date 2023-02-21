import { defineStyleConfig } from '@chakra-ui/react';

export const buttonTheme = defineStyleConfig({
  baseStyle: {
    _focusVisible: {
      outlineColor: 'blue.600',
      outlineOffset: '1px',
      boxShadow: 'none',
    },
  },
});
