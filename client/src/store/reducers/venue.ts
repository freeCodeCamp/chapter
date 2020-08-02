import produce from 'immer';
import { venuesTypes } from '../types';

const initialState: venuesTypes.IVenueStoreState = {
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
  venues: [],
  error: '',
};

const reducer = (state = initialState, action: venuesTypes.IVenueActionTypes) =>
  produce(state, draft => {
    switch (action.type) {
      case venuesTypes.FETCH_START:
        draft.error = '';
        draft.loading = true;
        break;
      case venuesTypes.FETCH_SUCCESS:
        draft.venues = action.payload.venues;
        draft.error = '';
        draft.loading = false;
        break;
      case venuesTypes.FETCH_FAIL:
        draft.error = action.payload;
        draft.loading = false;
        break;
      case venuesTypes.CREATE_START:
        draft.create.state = 'loading';
        draft.create.error = '';
        break;
      case venuesTypes.CREATE_SUCCESS:
        draft.create.state = 'idle';
        draft.create.error = '';
        draft.venues = [...draft.venues, action.payload.venue];
        break;
      case venuesTypes.CREATE_FAIL:
        draft.create.state = 'error';
        draft.create.error = action.payload;
        break;
      case venuesTypes.DELETE_START:
        draft.delete.loading = true;
        draft.delete.error = '';
        break;
      case venuesTypes.DELETE_SUCCESS:
        draft.delete.loading = false;
        draft.delete.error = '';
        draft.venues = draft.venues.filter(
          venue => venue.id !== action.payload.id,
        );
        break;
      case venuesTypes.DELETE_FAIL:
        draft.delete.loading = false;
        draft.delete.error = action.payload;
        break;
      case venuesTypes.FETCH_ONE_START:
        draft.loading = true;
        draft.error = '';
        break;
      case venuesTypes.FETCH_ONE_SUCCESS: {
        draft.loading = false;
        draft.error = '';

        const { id } = action.payload.venue;
        const venueExists = draft.venues.find(venue => venue.id === id);

        if (venueExists) {
          draft.venues = draft.venues.map(venue =>
            venue.id === id ? action.payload.venue : venue,
          );
        } else {
          draft.venues = [...draft.venues, action.payload.venue].sort(
            (l1, l2) => l1.id - l2.id,
          );
        }
        break;
      }
      case venuesTypes.FETCH_ONE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case venuesTypes.UPDATE_START:
        draft.update.loading = true;
        draft.update.error = '';
        break;
      case venuesTypes.UPDATE_SUCCESS:
        draft.update.loading = false;
        draft.update.error = '';
        draft.venues = draft.venues.map(venue =>
          venue.id === action.payload.id ? action.payload.venue : venue,
        );
        break;
      case venuesTypes.UPDATE_FAIL:
        draft.update.loading = false;
        draft.update.error = action.payload;
        break;
      default:
        return state;
    }
  });

export default reducer;
