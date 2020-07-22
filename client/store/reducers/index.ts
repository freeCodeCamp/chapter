import { combineReducers } from 'redux';

import chapterReducer from './chapter';
import eventsReducer from './events';
import locationsReducer from './locations';
import venuesReducer from './venue';

export const rootReducer = combineReducers({
  chapter: chapterReducer,
  events: eventsReducer,
  locations: locationsReducer,
  venues: venuesReducer,
});

export type AppStoreState = ReturnType<typeof rootReducer>;
