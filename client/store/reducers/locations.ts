import produce from 'immer';
import { locationsTypes } from '../types';

const initialState: locationsTypes.ILocationStoreState = {
  loading: true,
  create: {
    loading: false,
    error: '',
    done: false,
  },
  locations: [],
  error: '',
};

const reducer = (
  state = initialState,
  action: locationsTypes.ILocationActionTypes,
) =>
  produce(state, draft => {
    switch (action.type) {
      case locationsTypes.FETCH_START:
        draft.error = '';
        draft.loading = true;
        break;
      case locationsTypes.FETCH_SUCCESS:
        draft.locations = action.payload.locations;
        draft.error = '';
        draft.loading = false;
        break;
      case locationsTypes.FETCH_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case locationsTypes.CREATE_START:
        draft.create.loading = true;
        draft.create.error = '';
        draft.create.done = false;
        break;
      case locationsTypes.CREATE_SUCCESS:
        draft.create.loading = false;
        draft.create.error = '';
        draft.create.done = true;
        draft.locations = [...draft.locations, action.payload.location];
        break;
      case locationsTypes.CREATE_FAIL:
        draft.create.loading = false;
        draft.create.error = action.payload;
        draft.create.done = true;
        break;
      default:
        return state;
    }
  });

export default reducer;
