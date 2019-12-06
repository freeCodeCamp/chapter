import { combineReducers } from 'redux';
import chapterReducer from './chapter';

export const rootReducer = combineReducers({
  chapter: chapterReducer,
});

export type AppStoreState = ReturnType<typeof rootReducer>;
