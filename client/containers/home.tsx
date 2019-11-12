import Home from 'client/modules/home';
import { connect } from 'react-redux';
import { AppStoreState } from 'client/store/reducers';
import { ThunkDispatch } from 'redux-thunk';
import { IChapterActionTypes } from 'client/store/types/chapter';
import { chapterActions } from 'client/store/actions';

export interface IStateProps {
  loading: boolean;
  error: string;
  name: string;
  description: string;
}

export interface IDispatchProps {
  fetch: (_: string) => void;
}

const mapStateToProps = (state: AppStoreState): IStateProps => {
  return {
    error: state.chapter.error,
    loading: state.chapter.loading,
    name: state.chapter.name,
    description: state.chapter.description,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppStoreState, null, IChapterActionTypes>,
): IDispatchProps => {
  return {
    fetch: (chapterId: string) =>
      dispatch(chapterActions.fetchChapter(chapterId)),
  };
};

export default connect<IStateProps, IDispatchProps, any, AppStoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
