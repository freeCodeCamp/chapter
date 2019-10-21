import React from 'react';
import { render } from '@testing-library/react';

import { SomeComponent } from 'client/components/';

describe('SomeComponent', () => {
  it('should render text', () => {
    const { getByText } = render(<SomeComponent />);
    expect(getByText('This is an imported component')).toBeDefined();
  });
});
