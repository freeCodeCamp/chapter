import React from 'react';
import { render } from '@testing-library/react';

import Header from 'client/components/Header';

describe('Header', () => {
  it('should render text', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Nav/Logo could go')).toBeDefined();
  });
});
