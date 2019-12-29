import React from 'react';
import { action } from '@storybook/addon-actions';

export const withFixedWidth = (styles = {}) => (storyFn: Function) => {
  return (
    <div
      style={{
        padding: 32,
        width: 400,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        ...styles,
      }}
    >
      {storyFn()}
    </div>
  );
};

/**
 * Mock NextJS `Link` and `Router` componentes and api.
 */

import Router from 'next/router';
import PropTypes from 'prop-types';

const actionWithPromise = e => {
  action('clicked link')(e);
  return new Promise((_, reject) => reject());
};

const mockedRouter = {
  push: actionWithPromise,
  replace: actionWithPromise,
  prefetch: () => {},
  route: '/mock-route',
  pathname: 'mock-path',
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
Router.router = mockedRouter;

export const withMockRouter = (mockRouter = mockedRouter) => (
  storyFn: Function,
) => {
  class MockRouterContext extends React.Component {
    public getChildContext() {
      return {
        router: { ...mockedRouter, ...mockRouter },
      };
    }
    public render() {
      return storyFn();
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  MockRouterContext.childContextTypes = {
    router: PropTypes.object,
  };

  return <MockRouterContext />;
};
