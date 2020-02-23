import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

import { locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import LocationForm from 'client/components/LocationForm';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

const NewLocation: React.FC = () => {
  const router = useRouter();
  const styles = useStyles();

  const { error, loading } = useSelector((state: AppStoreState) => ({
    error: state.locations.create.error,
    loading: state.locations.create.loading,
  }));
  const dispatch = useDispatch();

  const onSubmit = async data => {
    await dispatch(locationActions.create(data));
    router.replace('/dashboard/locations');
  };

  return (
    <>
      {error && <div className={styles.responseDiv}>{error}</div>}
      <LocationForm
        loading={loading}
        onSubmit={onSubmit}
        submitText={'Add location'}
      />
      {loading && <h1>Loading...</h1>}
    </>
  );
};

export default NewLocation;
