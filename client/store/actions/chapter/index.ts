import { ActionCreator } from 'redux';
import { HttpService } from 'client/services/http-service';
import { chapterTypes } from '../../types';

import { fetchStart, fetchSuccess, fetchFail } from './actions';

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
