import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/chapter';
export * from './actions/chapter';

export interface IChapterModal {
  id?: string;
  name: string;
  description: string;
  category: string;
}

export interface IChapterStoreState extends IChapterModal {
  loading: boolean;
  error: string; // Should reflect a generic Error Type here
}

interface IChapterFetchStartAction {
  type: typeof ACTIONS.FETCH_START;
}

interface IChapterFetchSuccessAction {
  type: typeof ACTIONS.FETCH_SUCCESS;
  payload: IChapterModal;
}

interface IChapterFetchFailureAction {
  type: typeof ACTIONS.FETCH_FAIL;
  payload: string;
}

export type IChapterActionTypes =
  | IChapterFetchStartAction
  | IChapterFetchSuccessAction
  | IChapterFetchFailureAction;

// https://github.com/reduxjs/redux-thunk/issues/103#issuecomment-298526567
export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  IChapterActionTypes
>;

export type AppDispatch = ThunkDispatch<
  AppStoreState,
  any,
  IChapterActionTypes
>;
