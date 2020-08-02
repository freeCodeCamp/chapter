import produce from 'immer';
import { locationsTypes } from '../types';

const initialState: locationsTypes.ILocationStoreState = {
  loading: true,
  create: {
    state: 'idle',
    error: '',
  },
  delete: {
    loading: false,
    error: '',
  },
  update: {
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
        draft.create.state = 'loading';
        draft.create.error = '';
        break;
      case locationsTypes.CREATE_SUCCESS:
        draft.create.state = 'idle';
        draft.create.error = '';
        draft.locations = [...draft.locations, action.payload.location];
        break;
      case locationsTypes.CREATE_FAIL:
        draft.create.state = 'error';
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
          location => location.id !== action.payload.id,
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
      case locationsTypes.FETCH_ONE_SUCCESS: {
        draft.loading = false;
        draft.error = '';

        const { id } = action.payload.location;
        const locationExists = draft.locations.find(
          location => location.id === id,
        );

        if (locationExists) {
          draft.locations = draft.locations.map(location =>
            location.id === id ? action.payload.location : location,
          );
        } else {
          draft.locations = [...draft.locations, action.payload.location].sort(
            (l1, l2) => l1.id - l2.id,
          );
        }
        break;
      }
      case locationsTypes.FETCH_ONE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case locationsTypes.UPDATE_START:
        draft.update.loading = true;
        draft.update.error = '';
        break;
      case locationsTypes.UPDATE_SUCCESS:
        draft.update.loading = false;
        draft.update.error = '';
        draft.locations = draft.locations.map(location =>
          location.id === action.payload.id
            ? action.payload.location
            : location,
        );
        break;
      case locationsTypes.UPDATE_FAIL:
        draft.update.loading = false;
        draft.update.error = action.payload;
        break;
      default:
        return state;
    }
  });

export default reducer;
