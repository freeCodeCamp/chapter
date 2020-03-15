import { eventsTypes } from 'client/store/types';

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

export const removeSuccess = (
  id: number,
  chapterId: number,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.REMOVE_SUCCESS,
    payload: { id, chapterId },
  };
};

export const removeFail = (error: string): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.REMOVE_FAIL,
    payload: error,
  };
};
