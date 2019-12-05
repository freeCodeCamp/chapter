import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

export const FETCH_START = 'fcc/chapter/CHAPTER_START';
export const FETCH_SUCCESS = 'fcc/chapter/CHAPTER_SUCCESS';
export const FETCH_FAIL = 'fcc/chapter/CHAPTER_FAIL';

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
  type: typeof FETCH_START;
}

interface IChapterFetchSuccessAction {
  type: typeof FETCH_SUCCESS;
  payload: IChapterModal;
}

interface IChapterFetchFailureAction {
  type: typeof FETCH_FAIL;
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
