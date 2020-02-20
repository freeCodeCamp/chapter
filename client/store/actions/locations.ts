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

/****************
 * Side-Effects
 ****************/
export const fetchLocations: ActionCreator<locationsTypes.ThunkResult<
  Promise<void>
>> = () => async dispatch => {
  dispatch(fetchStart());

  // TODO: for the PR to be simple, haven't added any specific HTTP Service,
  // But we can make HTTPService some kind of builder, to return us back with specific
  // modal service, like LocationsHttpService.
  const http = new HttpService<locationsTypes.ILocationModal[]>();
  try {
    const resData = await http.get(`/locations`, {}, {});
    dispatch(fetchSuccess(resData));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const create: ActionCreator<locationsTypes.ThunkResult<
  Promise<void>
>> = data => async dispatch => {
  dispatch(createStart());
  console.log('HERE');

  const http = new HttpService<locationsTypes.ILocationModal>();
  try {
    console.log(data);
    const resData = await http.post(`/locations`, {}, JSON.stringify(data), {});
    console.log('Done request');
    dispatch(createSuccess(resData));
  } catch (err) {
    dispatch(createFail(err));
  }
};
