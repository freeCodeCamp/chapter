import produce from 'immer';
import { eventsTypes } from '../types';
import { IEventModal } from '../types/events';

const initialState: eventsTypes.IEventStoreState = {
  loading: true,
  events: [],
  chapterId: '',
  error: '',
  create: {
    state: 'idle',
    error: '',
  },
  update: {},
};

const reducer = (state = initialState, action: eventsTypes.IEventActionTypes) =>
  produce(state, draft => {
    switch (action.type) {
      case eventsTypes.FETCH_START:
        draft.error = '';
        draft.loading = true;
        break;
      case eventsTypes.FETCH_SUCCESS:
        draft.chapterId = action.payload.chapterId;
        draft.events = action.payload.events;
        draft.error = '';
        draft.loading = false;
        break;
      case eventsTypes.FETCH_SINGLE_SUCCESS:
        draft.chapterId = action.payload.chapterId;
        if (draft.events.find(event => event.id === action.payload.event.id)) {
          draft.events = draft.events.map(event =>
            event.id === action.payload.event.id ? action.payload.event : event,
          );
        } else {
          draft.events = [...draft.events, action.payload.event];
        }
        draft.error = '';
        draft.loading = false;
        break;
      case eventsTypes.FETCH_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case eventsTypes.FETCH_RSVPS_START: {
        const index = draft.events.findIndex(
          event => event.id === action.payload.id,
        );
        if (index !== -1) {
          if (!draft.events[index].rsvps) {
            draft.events[index].rsvps = { loading: true, error: '', rsvps: [] };
          } else {
            draft.events[index].rsvps.loading = true;
            draft.events[index].rsvps.error = '';
          }
        } else {
          console.log('CANT FIND EVENT START');
          // draft.events[action.payload.id] = { id: action.payload.id };
        }
        break;
      }
      case eventsTypes.FETCH_RSVPS_SUCCESS: {
        const index = draft.events.findIndex(
          event => event.id === action.payload.id,
        );
        if (index !== -1) {
          draft.events[index].rsvps.loading = false;
          draft.events[index].rsvps.error = '';
          draft.events[index].rsvps.rsvps = action.payload.rsvps;
        } else {
          console.log('CANT FIND EVENT SUCCESS');
          // draft.events[action.payload.id] = { id: action.payload.id };
        }
        break;
      }
      case eventsTypes.FETCH_RSVPS_FAIL: {
        const index = draft.events.findIndex(
          event => event.id === action.payload.id,
        );
        if (index !== -1) {
          draft.events[index].rsvps.loading = false;
          draft.events[index].rsvps.error = action.payload.error;
        } else {
          console.log('CANT FIND EVENT FAIL');
          // draft.events[action.payload.id] = { id: action.payload.id };
        }
        break;
      }
      case eventsTypes.CREATE_START:
        draft.create.state = 'loading';
        draft.create.error = '';
        break;
      case eventsTypes.CREATE_SUCCESS: {
        draft.create.state = 'idle';
        draft.create.error = '';
        const event: IEventModal = action.payload.response.event;
        event.tags = action.payload.response.tags;
        draft.events = [...draft.events, event];
        break;
      }
      case eventsTypes.CREATE_FAIL:
        draft.create.state = 'error';
        draft.create.error = action.payload;
        break;
      case eventsTypes.UPDATE_START:
        draft.update[action.payload.id] = { state: 'loading', error: '' };
        break;
      case eventsTypes.UPDATE_SUCCESS:
        draft.update[action.payload.id].state = 'idle';
        draft.update[action.payload.id].error = '';
        draft.events = draft.events.map(event =>
          event.id === action.payload.id ? action.payload.event : event,
        );
        break;
      case eventsTypes.UPDATE_FAIL:
        draft.update[action.payload.id].state = 'error';
        draft.update[action.payload.id].error = action.payload.error;
        break;
      case eventsTypes.REMOVE_SUCCESS:
        draft.events = draft.events.filter(
          item => item.id !== action.payload.id,
        );
        break;
      case eventsTypes.REMOVE_FAIL:
        console.error('Remove failed');
        break;
      default:
        return state;
    }
  });

export default reducer;
