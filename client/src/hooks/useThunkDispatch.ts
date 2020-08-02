import { useDispatch } from 'react-redux';
import { AppDispatch } from 'client/store/types/chapter';

// Override types with our thunk setup so typescript doesn't use the default and complain
const useThunkDispatch = () => {
  const dispatch: AppDispatch = useDispatch();
  return dispatch;
};

export default useThunkDispatch;
