import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import { rootReducer } from '../client/store/reducers';

export default initialState => {
  let store;
  const isClient = typeof window !== 'undefined';

  const composeEnhancers =
    (typeof window !== 'undefined' &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  if (isClient) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;
    const persistConfig = {
      key: 'root',
      storage,
    };

    store = createStore(
      persistReducer(persistConfig, rootReducer),
      initialState,
      composeEnhancers(applyMiddleware(thunk)),
    );
    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(
      rootReducer,
      initialState,
      composeEnhancers(applyMiddleware(thunk)),
    );
  }

  return store;
};
