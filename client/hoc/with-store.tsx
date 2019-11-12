import { rootReducer } from 'client/store/reducers';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

export function withStore(Component: React.ComponentType) {
  return class extends React.Component {
    public render() {
      return (
        <Provider store={store}>
          <Component />
        </Provider>
      );
    }
  };
}
