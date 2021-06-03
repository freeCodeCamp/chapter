/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { EventCard } from '../src/components/EventCard';

describe('EventCard', () => {
  it('should render', () => {
    const { container } = render(
      <EventCard
        event={{
          chapter: { id: 1, name: 'foo' },
          id: 1,
          name: 'bar',
          description: 'baz',
          start_at: 123,
          invite_only: true,
          canceled: false,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
