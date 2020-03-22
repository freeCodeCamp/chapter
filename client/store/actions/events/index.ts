import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { eventsTypes } from '../../types';
import {
  fetchStart,
  fetchSuccess,
  fetchFail,
  fetchSingleSuccess,
  createStart,
  createFail,
  createSuccess,
  removeFail,
  removeSuccess,
  updateSuccess,
  updateFail,
  updateStart,
  fetchRSVPSStart,
  fetchRSVPSFail,
  fetchRSVPSSuccess,
} from './actions';

export const fetchEvents: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: string) => async dispatch => {
  dispatch(fetchStart());

  const http = new HttpService<eventsTypes.IEventModal[]>();
  try {
    const { resData } = await http.get(`/chapters/${chapterId}/events`, {}, {});
    dispatch(fetchSuccess(resData, chapterId));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const fetchEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<eventsTypes.IEventModal | void>
>> = (chapterId: string, eventId: string) => async dispatch => {
  dispatch(fetchStart());

  const http = new HttpService<eventsTypes.IEventModal>();
  try {
    const { resData } = await http.get(
      `/chapters/${chapterId}/events/${eventId}`,
      {},
      {},
    );
    dispatch(fetchSingleSuccess(resData, chapterId));

    return resData;
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const fetchRSVPS: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: number, eventId: number) => async dispatch => {
  dispatch(fetchRSVPSStart(eventId));

  const http = new HttpService<eventsTypes.IRSVPModal[]>();
  try {
    const { resData } = await http.get(
      `/chapters/${chapterId}/events/${eventId}/rsvps`,
      {},
      {},
    );
    dispatch(fetchRSVPSSuccess(resData, eventId));
  } catch (err) {
    dispatch(fetchRSVPSFail(eventId, err));
  }
};

type CreateResponse = { success: boolean; id?: number };

export const createEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<CreateResponse>
>> = (data: any) => async dispatch => {
  dispatch(createStart());

  // TODO: Add new HTTP service when #342 is merged
  try {
    const res = await fetch(`/api/v1/chapters/1/events`, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    if (res.status !== 201) {
      throw new Error(resData.error.message);
    }

    dispatch(createSuccess(resData));

    return { success: true, id: resData.event.id };
  } catch (err) {
    dispatch(createFail(err.message));
  }
  return { success: false };
};

export const updateEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<boolean>
>> = (id: number, data: any) => async dispatch => {
  dispatch(updateStart(id));

  const http = new HttpService<any>();
  try {
    const { res, resData } = await http.patch(
      `/chapters/1/events/${id}`,
      {},
      data,
      {},
    );

    if (!res.ok) {
      throw new Error(JSON.parse(resData.message).error.message);
    }

    dispatch(updateSuccess(id, resData));
    return true;
  } catch (err) {
    dispatch(updateFail(id, err.message));
  }
  return false;
};

export const cancelEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: string, eventId: string) => async dispatch => {
  const http = new HttpService<eventsTypes.IEventModal>();
  try {
    const { resData } = await http.delete(
      `/chapters/${chapterId}/events/${eventId}/cancel`,
      {},
      {},
    );
    dispatch(fetchSingleSuccess(resData, chapterId));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const removeEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: string, eventId: string) => async dispatch => {
  const http = new HttpService<{ id: number }>();
  try {
    const { resData } = await http.delete(
      `/chapters/${chapterId}/events/${eventId}`,
      {},
      {},
    );
    dispatch(removeSuccess(resData.id, parseInt(chapterId)));
  } catch (err) {
    dispatch(removeFail(err));
  }
};
