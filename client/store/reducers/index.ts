import { combineReducers } from 'redux';

import chapterReducer from './chapter';
import eventsReducer from './events';
import locationsReducer from './locations';

export const rootReducer = combineReducers({
  chapter: chapterReducer,
  events: eventsReducer,
  locations: locationsReducer,
});

export type AppStoreState = ReturnType<typeof rootReducer>;
