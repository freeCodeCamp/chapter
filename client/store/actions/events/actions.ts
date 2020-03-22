import { eventsTypes } from 'client/store/types';

export const fetchRSVPSStart = (
  eventId: number,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_RSVPS_START,
    payload: { id: eventId },
  };
};

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

export const fetchRSVPSSuccess = (
  rsvps: eventsTypes.IRSVPModal[],
  id: number,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_RSVPS_SUCCESS,
    payload: { rsvps, id },
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

export const fetchRSVPSFail = (
  id: number,
  error: string,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.FETCH_RSVPS_FAIL,
    payload: {
      id,
      error,
    },
  };
};

export const createStart = (): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_START,
  };
};

export const createSuccess = (response: {
  event: eventsTypes.IEventModal;
  tags: eventsTypes.ITagModal[];
}): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_SUCCESS,
    payload: { response },
  };
};

export const createFail = (error: string): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.CREATE_FAIL,
    payload: error,
  };
};

export const updateStart = (id: number): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.UPDATE_START,
    payload: { id },
  };
};

export const updateSuccess = (
  id: number,
  event: eventsTypes.IEventModal,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.UPDATE_SUCCESS,
    payload: { id, event },
  };
};

export const updateFail = (
  id: number,
  error: string,
): eventsTypes.IEventActionTypes => {
  return {
    type: eventsTypes.UPDATE_FAIL,
    payload: { id, error },
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
