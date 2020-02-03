/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { SomeComponent } from 'client/components';
import theme from 'styles/theme';

describe('SomeComponent', () => {
  it('should render text', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <SomeComponent />
      </ThemeProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
