import { ThunkAction } from 'redux-thunk';
import { AppStoreState } from '../reducers';

import * as ACTIONS from './actions/locations';
export * from './actions/locations';

export interface ILocationModal {
  id?: string;
  country_code: string;
  city: string;
  region: string;
  address?: string;
  postal_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface ILocationStoreState {
  locations: ILocationModal[];
  create: {
    loading: boolean;
    error: string;
    done: boolean;
  };
  loading: boolean;
  error: string; // Should reflect a generic Error Type here
}

interface ILocationFetchStartAction {
  type: typeof ACTIONS.FETCH_START;
}

interface ILocationFetchSuccessAction {
  type: typeof ACTIONS.FETCH_SUCCESS;
  payload: {
    locations: ILocationModal[];
  };
}

interface ILocationFetchFailureAction {
  type: typeof ACTIONS.FETCH_FAIL;
  payload: string;
}

interface ILocationCreateStartAction {
  type: typeof ACTIONS.CREATE_START;
}

interface ILocationCreateSuccessAction {
  type: typeof ACTIONS.CREATE_SUCCESS;
  payload: {
    location: ILocationModal;
  };
}

interface ILocationCreateFailureAction {
  type: typeof ACTIONS.CREATE_FAIL;
  payload: string;
}

export type ILocationActionTypes =
  | ILocationFetchStartAction
  | ILocationFetchSuccessAction
  | ILocationFetchFailureAction
  | ILocationCreateStartAction
  | ILocationCreateSuccessAction
  | ILocationCreateFailureAction;

export type ThunkResult<R> = ThunkAction<
  R,
  AppStoreState,
  null,
  ILocationActionTypes
>;
