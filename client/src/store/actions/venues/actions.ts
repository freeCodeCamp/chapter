import { venuesTypes } from 'client/store/types';

export const fetchStart = (): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_START,
  };
};

export const fetchSuccess = (
  venues: venuesTypes.IVenueModal[],
): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_SUCCESS,
    payload: { venues },
  };
};

export const fetchFail = (error: string): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_FAIL,
    payload: error,
  };
};

export const createStart = (): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.CREATE_START,
  };
};

export const createSuccess = (
  venue: venuesTypes.IVenueModal,
): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.CREATE_SUCCESS,
    payload: { venue },
  };
};

export const createFail = (error: string): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.CREATE_FAIL,
    payload: error,
  };
};

export const deleteStart = (): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.DELETE_START,
  };
};

export const deleteSuccess = (resData: {
  id: number;
}): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.DELETE_SUCCESS,
    payload: resData,
  };
};

export const deleteFail = (error: string): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.DELETE_FAIL,
    payload: error,
  };
};

export const fetchOneStart = (): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_ONE_START,
  };
};

export const fetchOneSuccess = (
  venue: venuesTypes.IVenueModal,
): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_ONE_SUCCESS,
    payload: { venue },
  };
};

export const fetchOneFail = (error: string): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.FETCH_ONE_FAIL,
    payload: error,
  };
};

export const updateStart = (): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.UPDATE_START,
  };
};

export const updateSuccess = (
  id: number,
  venue: venuesTypes.IVenueModal,
): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.UPDATE_SUCCESS,
    payload: { id, venue },
  };
};

export const updateFail = (error: string): venuesTypes.IVenueActionTypes => {
  return {
    type: venuesTypes.UPDATE_FAIL,
    payload: error,
  };
};
