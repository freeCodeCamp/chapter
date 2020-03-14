import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { eventsTypes } from '../types';

/****************
 * Actions
 ****************/
export const fetchStart = (): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_START,
  };
};

export const fetchSuccess = (
  events: eventsTypes.IEventModal[],
  chapterId: string,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_SUCCESS,
    payload: { events, chapterId },
  };
};

export const fetchSingleSuccess = (
  event: eventsTypes.IEventModal,
  chapterId: string,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_SINGLE_SUCCESS,
    payload: { event, chapterId },
  };
};

export const fetchFail = (error: string): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_FAIL,
    payload: error,
  };
};

export const createStart = (): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_START,
  };
};

export const createSuccess = (
  event: eventsTypes.IEventModal,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_SUCCESS,
    payload: { event },
  };
};

export const createFail = (error: string): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_FAIL,
    payload: error,
  };
};

/****************
 * Side-Effects
 ****************/
export const fetchEvents: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: string) => async dispatch => {
  dispatch(fetchStart());

  // TODO: for the PR to be simple, haven't added any specific HTTP Service,
  // But we can make HTTPService some kind of builder, to return us back with specific
  // modal service, like EventsHttpService.
  const http = new HttpService<eventsTypes.IEventModal[]>();
  try {
    const resData = await http.get(`/chapters/${chapterId}/events`, {}, {});
    dispatch(fetchSuccess(resData, chapterId));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};

export const createEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<boolean>
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

    return true;
  } catch (err) {
    dispatch(createFail(err.message));
  }
  return false;
};

export const cancelEvent: ActionCreator<eventsTypes.ThunkResult<
  Promise<void>
>> = (chapterId: string, eventId: string) => async dispatch => {
  const http = new HttpService<eventsTypes.IEventModal>();
  try {
    const resData = await http.delete(
      `/chapters/${chapterId}/events/${eventId}/cancel`,
      {},
      {},
    );
    dispatch(fetchSingleSuccess(resData, chapterId));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};
