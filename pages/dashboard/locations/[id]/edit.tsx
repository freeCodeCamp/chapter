import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

import { locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import sanitizeFormData from 'client/helpers/sanitizeFormData';
import useThunkDispatch from 'client/hooks/useThunkDispatch';
import { LocationForm, Skeleton } from 'client/components/Dashboard/Locations';
import Layout from 'client/components/Dashboard/shared/Layout';

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
  const dispatch = useThunkDispatch();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(locationActions.fetchOneLocation(id));
    }
  }, [id]);

  const onSubmit = async data => {
    const success = await dispatch(
      locationActions.updateLocation(
        parseInt(Array.isArray(id) ? id[0] : id),
        sanitizeFormData(data),
      ),
    );

    if (success) {
      router.replace('/dashboard/locations');
    }
  };

  if ((loading && !location) || error || !location) {
    return (
      <Layout>
        <Skeleton>
          <h1>{loading ? 'Loading...' : 'Error...'}</h1>
          {error && <div className={styles.responseDiv}>{error}</div>}
        </Skeleton>
      </Layout>
    );
  }

  return (
    <Layout>
      <Skeleton>
        <LocationForm
          loading={loading && !location}
          onSubmit={onSubmit}
          data={location}
          submitText={'Update location'}
        />
      </Skeleton>
    </Layout>
  );
};

export default EditLocation;
