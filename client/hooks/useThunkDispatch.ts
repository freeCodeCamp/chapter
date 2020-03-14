import { useDispatch } from 'react-redux';
import { AppDispatch } from 'client/store/types/chapter';

const useThunkDispatch = () => {
  const dispatch: AppDispatch = useDispatch();
  return dispatch;
};

export default useThunkDispatch;
