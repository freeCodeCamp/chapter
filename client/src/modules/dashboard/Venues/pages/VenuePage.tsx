import React from 'react';
import { NextPage } from 'next';
import { makeStyles, Card, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

import { Layout } from '../../shared/components/Layout';
import { useVenueQuery } from '../../../../generated/graphql';
import { getId } from '../../../../helpers/getId';
import { ProgressCardContent } from '../../../../components';
import getLocationString from '../../../../helpers/getLocationString';

const useStyles = makeStyles(() => ({
  responseDiv: {
    margin: '15px 0',
  },
}));

export const VenuePage: NextPage = () => {
  const styles = useStyles();
  const router = useRouter();
  const id = getId(router.query) || -1;

  const { loading, error, data } = useVenueQuery({ variables: { id } });

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
      <Card style={{ marginTop: '12px' }}>
        <ProgressCardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.venue.name}
          </Typography>

          <Typography variant="body2" color="textSecondary" component="p">
            {getLocationString(data.venue, true)}
          </Typography>
        </ProgressCardContent>
      </Card>
      <h3>Placeholder for events...</h3>
    </Layout>
  );
};
