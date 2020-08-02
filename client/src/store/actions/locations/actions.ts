import { locationsTypes } from 'client/store/types';

export const fetchStart = (): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_START,
  };
};

export const fetchSuccess = (
  locations: locationsTypes.ILocationModal[],
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_SUCCESS,
    payload: { locations },
  };
};

export const fetchFail = (
  error: string,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_FAIL,
    payload: error,
  };
};

export const createStart = (): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.CREATE_START,
  };
};

export const createSuccess = (
  location: locationsTypes.ILocationModal,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.CREATE_SUCCESS,
    payload: { location },
  };
};

export const createFail = (
  error: string,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.CREATE_FAIL,
    payload: error,
  };
};

export const deleteStart = (): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.DELETE_START,
  };
};

export const deleteSuccess = (resData: {
  id: number;
}): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.DELETE_SUCCESS,
    payload: resData,
  };
};

export const deleteFail = (
  error: string,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.DELETE_FAIL,
    payload: error,
  };
};

export const fetchOneStart = (): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_ONE_START,
  };
};

export const fetchOneSuccess = (
  location: locationsTypes.ILocationModal,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_ONE_SUCCESS,
    payload: { location },
  };
};

export const fetchOneFail = (
  error: string,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.FETCH_ONE_FAIL,
    payload: error,
  };
};

export const updateStart = (): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.UPDATE_START,
  };
};

export const updateSuccess = (
  id: number,
  location: locationsTypes.ILocationModal,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.UPDATE_SUCCESS,
    payload: { id, location },
  };
};

export const updateFail = (
  error: string,
): locationsTypes.ILocationActionTypes => {
  return {
    type: locationsTypes.UPDATE_FAIL,
    payload: error,
  };
};
