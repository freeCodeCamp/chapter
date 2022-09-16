import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  useVenueQuery,
  useUpdateVenueMutation,
} from '../../../../generated/graphql';

import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';
import VenueForm, { VenueFormData } from '../components/VenueForm';
import { VENUES } from '../graphql/queries';
import { useParam } from 'hooks/useParam';

export const EditVenuePage: NextPage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const router = useRouter();
  const { param: venueId, isReady: isVenueIdReady } = useParam('venueId');
  const { param: chapterId, isReady: isChapterIdReady } = useParam('id');

  const isReady = isVenueIdReady && isChapterIdReady;

  const { loading, error, data } = useVenueQuery({
    variables: { id: venueId },
  });
  const [updateVenue] = useUpdateVenueMutation({
    refetchQueries: [{ query: VENUES }],
  });

  const onSubmit = async (data: VenueFormData) => {
    setLoadingUpdate(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { chapter_id, ...updateData } = data;
    try {
      const latitude = parseFloat(String(data.latitude));
      const longitude = parseFloat(String(data.longitude));

      await updateVenue({
        variables: {
          venueId,
          chapterId,
          data: { ...updateData, latitude, longitude },
        },
      });
      await router.push('/dashboard/venues');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading || !isReady || error || !data?.venue) {
    return (
      <Layout>
        <h1>{loading || !isReady ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

  return (
    <Layout dataCy="edit-venue-page">
      <VenueForm
        data={data}
        loading={loadingUpdate}
        onSubmit={onSubmit}
        submitText={'Save Venue Changes'}
        chapterId={chapterId}
        loadingText={'Saving Venue Changes'}
      />
    </Layout>
  );
};
