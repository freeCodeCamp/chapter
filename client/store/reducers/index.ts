import { combineReducers } from 'redux';
import chapterReducer from './chapter';
import eventsReducer from './events';

export const rootReducer = combineReducers({
  chapter: chapterReducer,
  events: eventsReducer,
});

export type AppStoreState = ReturnType<typeof rootReducer>;
