import React from 'react';
import { render } from '@testing-library/react';

import Footer from 'client/components/Footer';

describe('Footer', () => {
  it('should render text', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Disclaimer/copyright.')).toBeDefined();
  });
});
