import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { venuesTypes } from '../types';

/****************
 * Actions
 ****************/
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

/****************
 * Side-Effects
 ****************/
export const fetchVenues: ActionCreator<venuesTypes.ThunkResult<
  Promise<void>
>> = () => async dispatch => {
  dispatch(fetchStart());

  const http = new HttpService<venuesTypes.IVenueModal[]>();
  try {
    const { resData } = await http.get(`/venues`, {}, {});
    dispatch(fetchSuccess(resData));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const create: ActionCreator<venuesTypes.ThunkResult<
  Promise<boolean>
>> = data => async dispatch => {
  dispatch(createStart());

  const http = new HttpService<any>();
  try {
    const { res, resData } = await http.post('/venues', {}, data, {});

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
export const remove: ActionCreator<venuesTypes.ThunkResult<
  Promise<void>
>> = id => async dispatch => {
  dispatch(deleteStart());

  const http = new HttpService<{ id: number }>();
  try {
    const { resData } = await http.delete(`/venues/${id}`, {}, {});

    dispatch(deleteSuccess(resData));
  } catch (err) {
    dispatch(deleteFail(err));
  }
};

export const fetchOneVenue: ActionCreator<venuesTypes.ThunkResult<
  Promise<void>
>> = (id: number) => async dispatch => {
  dispatch(fetchOneStart());

  const http = new HttpService<venuesTypes.IVenueModal>();
  try {
    const { resData } = await http.get(`/venues/${id}`, {}, {});

    dispatch(fetchOneSuccess(resData));
  } catch (err) {
    dispatch(fetchOneFail(err));
  }
};

export const updateVenue: ActionCreator<venuesTypes.ThunkResult<
  Promise<boolean>
>> = (id: number, data: Partial<venuesTypes.IVenueModal>) => async dispatch => {
  dispatch(updateStart());

  const http = new HttpService<venuesTypes.IVenueModal>();
  try {
    const { resData } = await http.patch(`/venues/${id}`, {}, data, {});

    dispatch(updateSuccess(id, resData));
    return true;
  } catch (err) {
    dispatch(updateFail(err));
  }

  return false;
};
