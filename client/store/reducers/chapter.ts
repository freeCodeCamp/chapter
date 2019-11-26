import produce from 'immer';
import { chapterTypes } from '../types';

const initialState: chapterTypes.IChapterStoreState = {
  name: '',
  description: '',
  category: '',
  loading: false,
  error: '',
};

const reducer = (
  state = initialState,
  action: chapterTypes.IChapterActionTypes,
) =>
  produce(state, draft => {
    switch (action.type) {
      case chapterTypes.FETCH_START:
        draft.error = '';
        draft.loading = true;
        break;
      case chapterTypes.FETCH_SUCCESS:
        draft.id = action.data.id;
        draft.name = action.data.name;
        draft.description = action.data.description;
        draft.category = action.data.category;
        draft.error = '';
        draft.loading = false;
        break;
      case chapterTypes.FETCH_FAIL:
        draft.error = action.error;
        draft.loading = false;
        break;
      default:
        return state;
    }
  });

export default reducer;
