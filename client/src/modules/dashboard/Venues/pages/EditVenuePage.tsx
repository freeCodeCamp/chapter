import React, { useState } from 'react';
import { NextPage } from 'next';

import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { useRouter } from 'next/router';
import {
  useVenueQuery,
  useUpdateVenueMutation,
} from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import { makeStyles } from '@material-ui/core';
import { VENUES } from '../graphql/queries';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

export const EditVenuePage: NextPage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const styles = useStyles();
  const router = useRouter();
  const id = getId(router.query) || -1;

  const { loading, error, data } = useVenueQuery({ variables: { id } });
  const [updateVenue] = useUpdateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    setLoadingUpdate(true);
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      await updateVenue({
        variables: { id, data: { ...data, latitude, longitude } },
      });
      await router.push('/dashboard/venues');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading || error || !data?.venue) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.responseDiv}>{error}</div>}
      </Layout>
    );
  }

  return (
    <Layout>
      <VenueForm
        data={data}
        loading={loadingUpdate}
        onSubmit={onSubmit}
        submitText={'Update venue'}
      />
    </Layout>
  );
};
