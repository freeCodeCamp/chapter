import { addDecorator, addParameters, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addDecorator(withA11y);

// Option defaults:
addParameters({
  options: {
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name: 'Chapter',
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
});

configure(require.context('../client/stories', true, /\.(ts|md)x?$/), module);
