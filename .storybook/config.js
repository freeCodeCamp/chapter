import { addDecorator, addParameters, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addDecorator(withA11y);

// Option defaults:
addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name: 'Chapter Storybook',
    showRoots: true,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
});

configure(require.context('../client/stories', true, /\.(ts|md)x?$/), module);
