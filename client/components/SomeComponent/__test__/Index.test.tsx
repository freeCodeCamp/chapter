/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { SomeComponent } from 'client/components';
import { themeObject } from 'styles/theme';

describe('SomeComponent', () => {
  it('should render text', () => {
    const { container } = render(
      <ThemeProvider theme={themeObject}>
        <SomeComponent />
      </ThemeProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
