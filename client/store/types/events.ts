import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/events';
export * from './actions/events';

export interface ITagModal {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface IRSVPModal {
  id: number;
  date: string;
  on_waitlist: boolean;
  user?: IUser;
  created_at: string;
  updated_at: string;
}

export interface IEventModal {
  id?: number;
  chapterId?: string;
  venue?: number;
  tags?: ITagModal[];
  rsvps: {
    loading: boolean;
    error: string;
    rsvps: IRSVPModal[];
  };
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
  update: {
    [key: number]: {
      state: 'idle' | 'error' | 'loading';
      error: string;
    };
  };
}

interface IEventFetchStartAction {
  type: typeof ACTIONS.FETCH_START;
}

interface IEventFetchRSVPSStartAction {
  type: typeof ACTIONS.FETCH_RSVPS_START;
  payload: {
    id: number;
  };
}

interface IEventFetchSuccessAction {
  type: typeof ACTIONS.FETCH_SUCCESS;
  payload: {
    events: IEventModal[];
    chapterId: string;
  };
}

interface IEventFetchRSVPSSuccessAction {
  type: typeof ACTIONS.FETCH_RSVPS_SUCCESS;
  payload: {
    id: number;
    rsvps: IRSVPModal[];
  };
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

interface IEventFetchRSVPSFailureAction {
  type: typeof ACTIONS.FETCH_RSVPS_FAIL;
  payload: {
    id: number;
    error: string;
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
    response: {
      event: IEventModal;
      tags: ITagModal[];
    };
  };
}

interface IEventCreateFailureAction {
  type: typeof ACTIONS.CREATE_FAIL;
  payload: string;
}

interface IEventUpdateStartAction {
  type: typeof ACTIONS.UPDATE_START;
  payload: {
    id: number;
  };
}

interface IEventUpdateSuccessAction {
  type: typeof ACTIONS.UPDATE_SUCCESS;
  payload: {
    id: number;
    event: IEventModal;
  };
}

interface IEventUpdateFailureAction {
  type: typeof ACTIONS.UPDATE_FAIL;
  payload: {
    id: number;
    error: string;
  };
}

interface IEventRemoveSuccessAction {
  type: typeof ACTIONS.REMOVE_SUCCESS;
  payload: {
    id: number;
    chapterId: number;
  };
}

interface IEventRemoveFailureAction {
  type: typeof ACTIONS.REMOVE_FAIL;
  payload: string;
}

export type IEventActionTypes =
  | IEventFetchStartAction
  | IEventFetchSuccessAction
  | IEventFetchFailureAction
  | IEventFetchSingleSuccessAction
  | IEventFetchRSVPSStartAction
  | IEventFetchRSVPSSuccessAction
  | IEventFetchRSVPSFailureAction
  | IEventCreateSuccessAction
  | IEventCreateStartAction
  | IEventCreateFailureAction
  | IEventUpdateStartAction
  | IEventUpdateSuccessAction
  | IEventUpdateFailureAction
  | IEventRemoveSuccessAction
  | IEventRemoveFailureAction;

export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  IEventActionTypes
>;
