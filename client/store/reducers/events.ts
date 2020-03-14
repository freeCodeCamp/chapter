import produce from 'immer';
import { eventsTypes } from '../types';

const initialState: eventsTypes.IEventStoreState = {
  loading: true,
  events: [],
  chapterId: '',
  error: '',
  create: {
    state: 'idle',
    error: '',
  },
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
        draft.events = draft.events.map(event =>
          event.id === action.payload.event.id ? action.payload.event : event,
        );
        draft.error = '';
        draft.loading = false;
        break;
      case eventsTypes.FETCH_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case eventsTypes.CREATE_START:
        draft.create.state = 'loading';
        draft.create.error = '';
        break;
      case eventsTypes.CREATE_SUCCESS:
        draft.create.state = 'idle';
        draft.create.error = '';
        draft.events = [...draft.events, action.payload.event];
        break;
      case eventsTypes.CREATE_FAIL:
        draft.create.state = 'error';
        draft.create.error = action.payload;
        break;
      default:
        return state;
    }
  });

export default reducer;
