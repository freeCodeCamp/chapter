import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/venues';
import { ILocationModal } from './locations';
export * from './actions/venues';

// TODO: Refactor out location requirement and join it with locations store
export interface IVenueModal {
  id: number;
  name: string;
  location?: ILocationModal;
  created_at?: string;
  updated_at?: string;
}

export interface IVenueStoreState {
  venues: IVenueModal[];
  create: {
    state: 'idle' | 'error' | 'loading';
    error: string;
  };
  delete: {
    loading: boolean;
    error: string;
  };
  update: {
    loading: boolean;
    error: string;
  };
  loading: boolean;
  error: string; // Should reflect a generic Error Type here
}

interface IVenueFetchStartAction {
  type: typeof ACTIONS.FETCH_START;
}

interface IVenueFetchSuccessAction {
  type: typeof ACTIONS.FETCH_SUCCESS;
  payload: {
    venues: IVenueModal[];
  };
}

interface IVenueFetchFailureAction {
  type: typeof ACTIONS.FETCH_FAIL;
  payload: string;
}

interface IVenueCreateStartAction {
  type: typeof ACTIONS.CREATE_START;
}

interface IVenueCreateSuccessAction {
  type: typeof ACTIONS.CREATE_SUCCESS;
  payload: {
    venue: IVenueModal;
  };
}

interface IVenueCreateFailureAction {
  type: typeof ACTIONS.CREATE_FAIL;
  payload: string;
}

interface IVenueDeleteFailureAction {
  type: typeof ACTIONS.DELETE_FAIL;
  payload: string;
}

interface IVenueDeleteStartAction {
  type: typeof ACTIONS.DELETE_START;
}

interface IVenueDeleteSuccessAction {
  type: typeof ACTIONS.DELETE_SUCCESS;
  payload: {
    id: number;
  };
}

interface IVenueFetchOneStartAction {
  type: typeof ACTIONS.FETCH_ONE_START;
}

interface IVenueFetchOneSuccessAction {
  type: typeof ACTIONS.FETCH_ONE_SUCCESS;
  payload: {
    venue: IVenueModal;
  };
}

interface IVenueFetchOneFailureAction {
  type: typeof ACTIONS.FETCH_ONE_FAIL;
  payload: string;
}

interface IVenueUpdateStartAction {
  type: typeof ACTIONS.UPDATE_START;
}

interface IVenueUpdateSuccessAction {
  type: typeof ACTIONS.UPDATE_SUCCESS;
  payload: {
    id: number;
    venue: IVenueModal;
  };
}

interface IVenueUpdateFailureAction {
  type: typeof ACTIONS.UPDATE_FAIL;
  payload: string;
}

export type IVenueActionTypes =
  | IVenueFetchStartAction
  | IVenueFetchSuccessAction
  | IVenueFetchFailureAction
  | IVenueCreateStartAction
  | IVenueCreateSuccessAction
  | IVenueCreateFailureAction
  | IVenueDeleteFailureAction
  | IVenueDeleteStartAction
  | IVenueDeleteSuccessAction
  | IVenueFetchOneStartAction
  | IVenueFetchOneSuccessAction
  | IVenueFetchOneFailureAction
  | IVenueUpdateStartAction
  | IVenueUpdateSuccessAction
  | IVenueUpdateFailureAction;

export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  IVenueActionTypes
>;
