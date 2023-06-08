/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import React from 'react';
import { EventCard } from '../src/components/EventCard';

const event = {
  chapter: { id: 1, name: 'foo' },
  id: 1,
  name: 'bar',
  description: 'baz',
  start_at: 123,
  ends_at: 123,
  invite_only: true,
  canceled: false,
  image_url: 'http://example.com/image.png',
  event_tags: [],
};

describe('EventCard', () => {
  it('should render', () => {
    const { container } = render(<EventCard event={event} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with tags', () => {
    const { container } = render(
      <EventCard
        event={{
          ...event,
          event_tags: [
            { tag: { id: 1, name: 'notfoo' } },
            { tag: { id: 2, name: 'notbar' } },
            { tag: { id: 3, name: 'notbaz' } },
          ],
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
