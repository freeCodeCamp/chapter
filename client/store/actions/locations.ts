import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { locationsTypes } from '../types';

/****************
 * Actions
 ****************/
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

/****************
 * Side-Effects
 ****************/
export const fetchLocations: ActionCreator<locationsTypes.ThunkResult<
  Promise<void>
>> = () => async dispatch => {
  dispatch(fetchStart());

  const http = new HttpService<locationsTypes.ILocationModal[]>();
  try {
    const { resData } = await http.get(`/locations`, {}, {});
    dispatch(fetchSuccess(resData));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const create: ActionCreator<locationsTypes.ThunkResult<
  Promise<boolean>
>> = data => async dispatch => {
  dispatch(createStart());

  const http = new HttpService<any>();
  try {
    const { res, resData } = await http.post('/locations', {}, data, {});

    if (res.status !== 201) {
      throw new Error(JSON.parse(resData.message).error.message);
    }

    dispatch(createSuccess(resData));
    return true;
  } catch (err) {
    dispatch(createFail(err.message));
  }
  return false;
};

// we can't do delete here
export const remove: ActionCreator<locationsTypes.ThunkResult<
  Promise<void>
>> = id => async dispatch => {
  dispatch(deleteStart());

  const http = new HttpService<{ id: number }>();
  try {
    const { resData } = await http.delete(`/locations/${id}`, {}, {});

    dispatch(deleteSuccess(resData));
  } catch (err) {
    dispatch(deleteFail(err));
  }
};

export const fetchOneLocation: ActionCreator<locationsTypes.ThunkResult<
  Promise<void>
>> = (id: number) => async dispatch => {
  dispatch(fetchOneStart());

  const http = new HttpService<locationsTypes.ILocationModal>();
  try {
    const { resData } = await http.get(`/locations/${id}`, {}, {});

    dispatch(fetchOneSuccess(resData));
  } catch (err) {
    dispatch(fetchOneFail(err));
  }
};

export const updateLocation: ActionCreator<locationsTypes.ThunkResult<
  Promise<boolean>
>> = (id: number, data: Partial<Location>) => async dispatch => {
  dispatch(updateStart());

  const http = new HttpService<locationsTypes.ILocationModal>();
  try {
    const { resData } = await http.patch(`/locations/${id}`, {}, data, {});

    dispatch(updateSuccess(id, resData));
    return true;
  } catch (err) {
    dispatch(updateFail(err));
  }

  return false;
};
