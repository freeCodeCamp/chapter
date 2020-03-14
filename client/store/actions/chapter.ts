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
    type: chapterTypes.FETCH_FAIL,
    payload: error,
  };
};

/****************
 * Side-Effects
 ****************/
export const fetchChapter: ActionCreator<chapterTypes.ThunkResult<
  Promise<void>
>> = (id: string) => async dispatch => {
  dispatch(fetchStart());

  const http = new HttpService<chapterTypes.IChapterModal>();
  try {
    const { resData } = await http.get(`/chapters/${id}`, {}, {});
    dispatch(fetchSuccess(resData));
  } catch (err) {
    dispatch(fetchFail(err));
  }
};
