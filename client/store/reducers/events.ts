import produce from 'immer';
import { eventsTypes } from '../types';

const initialState: eventsTypes.IEventStoreState = {
  loading: true,
  events: [],
  chapterId: '',
  error: '',
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
      case eventsTypes.FETCH_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;
      default:
        return state;
    }
  });

export default reducer;
