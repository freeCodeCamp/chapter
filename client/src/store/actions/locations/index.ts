import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { locationsTypes } from '../../types';
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
>> = (
  id: number,
  data: Partial<locationsTypes.ILocationModal>,
) => async dispatch => {
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
