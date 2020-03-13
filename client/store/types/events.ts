import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/events';
export * from './actions/events';

export interface IEventModal {
  id?: string;
  chapterId?: string;
  name: string;
  description: string;
  start_at: Date;
  ends_at: Date;
  canceled: boolean;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface IEventStoreState {
  chapterId: string;
  events: IEventModal[];
  loading: boolean;
  error: string; // Should reflect a generic Error Type here
}

interface IEventFetchStartAction {
  type: typeof ACTIONS.FETCH_START;
}

interface IEventFetchSuccessAction {
  type: typeof ACTIONS.FETCH_SUCCESS;
  payload: {
    events: IEventModal[];
    chapterId: string;
  };
}

interface IEventFetchFailureAction {
  type: typeof ACTIONS.FETCH_FAIL;
  payload: string;
}

export type IEventActionTypes =
  | IEventFetchStartAction
  | IEventFetchSuccessAction
  | IEventFetchFailureAction;

export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  IEventActionTypes
>;
