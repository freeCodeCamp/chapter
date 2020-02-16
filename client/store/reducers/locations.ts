import produce from 'immer';
import { locationsTypes } from '../types';

const initialState: locationsTypes.ILocationStoreState = {
  loading: true,
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
      default:
        return state;
    }
  });

export default reducer;
