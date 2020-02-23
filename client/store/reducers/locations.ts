import produce from 'immer';
import { locationsTypes } from '../types';

const initialState: locationsTypes.ILocationStoreState = {
  loading: true,
  create: {
    loading: false,
    error: '',
  },
  delete: {
    loading: false,
    error: '',
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
        break;
      case locationsTypes.CREATE_SUCCESS:
        draft.create.loading = false;
        draft.create.error = '';
        draft.locations = [...draft.locations, action.payload.location];
        break;
      case locationsTypes.CREATE_FAIL:
        draft.create.loading = false;
        draft.create.error = action.payload;
        break;
      case locationsTypes.DELETE_START:
        draft.delete.loading = true;
        draft.delete.error = '';
        break;
      case locationsTypes.DELETE_SUCCESS:
        draft.delete.loading = false;
        draft.delete.error = '';
        draft.locations = draft.locations.filter(
          location => location.id !== parseInt(action.payload.id),
        );
        break;
      case locationsTypes.DELETE_FAIL:
        draft.delete.loading = false;
        draft.delete.error = action.payload;
        break;
      case locationsTypes.FETCH_ONE_START:
        draft.loading = true;
        draft.error = '';
        break;
      case locationsTypes.FETCH_ONE_SUCCESS:
        draft.loading = false;
        draft.error = '';
        draft.locations = [...draft.locations, action.payload.location].sort(
          (l1, l2) => l1.id - l2.id,
        );
        break;
      case locationsTypes.FETCH_ONE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      default:
        return state;
    }
  });

export default reducer;
