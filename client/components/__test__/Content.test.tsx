import React from 'react';
import { render } from '@testing-library/react';

import Content from 'client/components/Content';

describe('Content', () => {
  it('should render text', () => {
    const { getByText } = render(<Content />);
    expect(getByText('This is an imported component')).toBeDefined();
  });
});
