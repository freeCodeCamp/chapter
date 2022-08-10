/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import React from 'react';
import { ChapterCard } from '../src/components/ChapterCard';

describe('ChapterCard', () => {
  it('should render', () => {
    const { container } = render(
      <ChapterCard
        chapter={{
          id: 1,
          name: 'bar',
          description: 'baz',
          category: 'foo',
          imageUrl: 'http://example.com/image.png',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with tags', () => {
    const { container } = render(
      <ChapterCard
        chapter={{
          id: 1,
          name: 'bar',
          description: 'baz',
          category: 'foo',
          imageUrl: 'http://example.com/image.png',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
