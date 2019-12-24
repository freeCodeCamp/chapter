import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { chapterTypes } from '../types';

/****************
 * Actions
 ****************/
export const fetchStart = (): chapterTypes.IChapterActionTypes => {
  return {
    type: chapterTypes.FETCH_START,
  };
};

export const fetchSuccess = (
  chapter: chapterTypes.IChapterModal,
): chapterTypes.IChapterActionTypes => {
  return {
    type: chapterTypes.FETCH_SUCCESS,
    payload: chapter,
  };
};

export const fetchFail = (error: string): chapterTypes.IChapterActionTypes => {
  return {
    payload: error,
    type: chapterTypes.FETCH_FAIL,
  };
};

/****************
 * Side-Effects
 ****************/
export const fetchChapter: ActionCreator<chapterTypes.ThunkResult<
  Promise<void>
>> = (id: string) => async dispatch => {
  dispatch(fetchStart());

  // TODO: for the PR to be simple, haven't added any specific HTTP Service,
  // But we can make HTTPService some kind of builder, to return us back with specific
  // modal service, like ChapterHttpService.
  const http = new HttpService<chapterTypes.IChapterModal>();
  try {
    const resData = await http.get(`/chapters/${id}`, {}, {});
    dispatch(fetchSuccess(resData));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};
