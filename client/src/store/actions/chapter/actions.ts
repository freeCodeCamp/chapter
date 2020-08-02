import { chapterTypes } from 'client/store/types';

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
