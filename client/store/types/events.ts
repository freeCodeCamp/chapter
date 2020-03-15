import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/events';
export * from './actions/events';

export interface IEventModal {
  id?: number;
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
  create: {
    state: 'idle' | 'error' | 'loading';
    error: string;
  };
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

interface IEventFetchSingleSuccessAction {
  type: typeof ACTIONS.FETCH_SINGLE_SUCCESS;
  payload: {
    event: IEventModal;
    chapterId: string;
  };
}

interface IEventFetchFailureAction {
  type: typeof ACTIONS.FETCH_FAIL;
  payload: string;
}

interface IEventCreateStartAction {
  type: typeof ACTIONS.CREATE_START;
}

interface IEventCreateSuccessAction {
  type: typeof ACTIONS.CREATE_SUCCESS;
  payload: {
    event: IEventModal;
  };
}

interface IEventCreateFailureAction {
  type: typeof ACTIONS.CREATE_FAIL;
  payload: string;
}

interface IEventRemoveSuccessAction {
  type: typeof ACTIONS.REMOVE_SUCCESS;
  payload: {
    id: number;
    chapterId: number;
  };
}

interface IEventRemoveFailuerAction {
  type: typeof ACTIONS.REMOVE_FAIL;
  payload: string;
}

export type IEventActionTypes =
  | IEventFetchStartAction
  | IEventFetchSuccessAction
  | IEventFetchFailureAction
  | IEventFetchSingleSuccessAction
  | IEventCreateSuccessAction
  | IEventCreateStartAction
  | IEventCreateFailureAction
  | IEventRemoveSuccessAction
  | IEventRemoveFailuerAction;

export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  IEventActionTypes
>;
