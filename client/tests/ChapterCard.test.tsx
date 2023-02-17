/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import React from 'react';
import { ChapterCard } from '../src/components/ChapterCard';

describe('ChapterCard', () => {
  it('should render', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-18'));
    const { container } = render(
      <ChapterCard
        chapter={{
          name: 'Name of the Chapter',
          description: 'Schaefer, McLaughlin and Conn',
          id: 1,
          banner_url: 'https://loremflickr.com/640/480/tech?75964',
          logo_url: 'https://loremflickr.com/150/150/tech?30938',
          events: [
            {
              canceled: true,
              id: 1,
              name: 'Canceled event',
              start_at: new Date('2023-01-20 10:00'),
              ends_at: new Date('2023-01-20 10:30'),
              invite_only: true,
            },
            {
              canceled: false,
              id: 6,
              name: 'Next event',
              start_at: new Date('2023-01-21 10:00'),
              ends_at: new Date('2023-01-21 10:30'),
              invite_only: false,
            },
            {
              canceled: false,
              id: 3,
              name: 'Past event',
              start_at: new Date('2023-01-15 20:00'),
              ends_at: new Date('2023-01-15 20:30'),
              invite_only: false,
            },
            {
              canceled: false,
              id: 5,
              name: 'Visible event',
              start_at: new Date('2023-01-25 08:00'),
              ends_at: new Date('2023-01-26 08:00'),
              invite_only: false,
            },
          ],
          chapter_users: [
            { subscribed: false },
            { subscribed: true },
            { subscribed: true },
          ],
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
