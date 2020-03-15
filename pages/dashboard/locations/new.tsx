import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

import { locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import sanitizeFormData from 'client/helpers/sanitizeFormData';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import { LocationForm, Skeleton } from 'client/components/Dashboard/Locations';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

const NewLocation: React.FC = () => {
  const router = useRouter();
  const styles = useStyles();

  const { error, state } = useSelector((state: AppStoreState) => ({
    error: state.locations.create.error,
    state: state.locations.create.state,
  }));

  const dispatch = useThunkDispatch();

  const onSubmit = async data => {
    const success = await dispatch(
      locationActions.create(sanitizeFormData(data)),
    );
    if (success) {
      router.replace('/dashboard/locations');
    }
  };

  return (
    <Skeleton>
      {error && <div className={styles.responseDiv}>{error}</div>}
      <LocationForm
        loading={state === 'loading'}
        onSubmit={onSubmit}
        submitText={'Add location'}
      />
    </Skeleton>
  );
};

export default NewLocation;
