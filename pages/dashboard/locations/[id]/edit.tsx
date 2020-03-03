import React, { useEffect } from 'react';
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

const EditLocation: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const styles = useStyles();

  const { error, loading, location } = useSelector((state: AppStoreState) => ({
    error: state.locations.error,
    loading: state.locations.loading,
    location: state.locations.locations.find(
      location => location.id === parseInt(Array.isArray(id) ? id[0] : id),
    ),
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(locationActions.fetchOneLocation(id));
    }
  }, [id]);

  const onSubmit = async data => {
    await dispatch(
      locationActions.updateLocation(
        parseInt(Array.isArray(id) ? id[0] : id),
        data,
      ),
    );
    router.replace('/dashboard/locations');
  };

  if (loading) return <h1>Loading...</h1>;
  if (error || !location) {
    console.error(error);
    return (
      <>
        <h1>Error...</h1>
        <div className={styles.responseDiv}>{error}</div>
      </>
    );
  }

  return (
    <LocationForm
      loading={loading}
      onSubmit={onSubmit}
      data={location}
      submitText={'Update location'}
    />
  );
};

export default EditLocation;
