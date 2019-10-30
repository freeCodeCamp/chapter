import React from 'react';
import { render } from '@testing-library/react';

import Sidebar from 'client/components/Sidebar';

describe('Sidebar', () => {
  it('should render text', () => {
    const { getByText } = render(<Sidebar />);
    getByText('Popout admin dashboard');
  });
});
