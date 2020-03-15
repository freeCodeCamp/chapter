import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { venuesTypes } from '../../types';
import {
  createStart,
  createSuccess,
  createFail,
  fetchStart,
  fetchSuccess,
  fetchFail,
  deleteStart,
  deleteSuccess,
  deleteFail,
  fetchOneStart,
  fetchOneSuccess,
  fetchOneFail,
  updateStart,
  updateSuccess,
  updateFail,
} from './actions';

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
