import React from 'react';
import Link from 'next/link';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { ProgressCardContent } from '../../components';
import { useHomePageQuery } from 'generated/graphql';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gridAutoRows: '1fr',
    gridGap: '1rem',
  },
  gridItem: {
    padding: '0.5rem',
  },
});

const Home: React.FC = () => {
  const { loading, error, data } = useHomePageQuery();
  const styles = useStyles();

  return (
    <>
      <div className={styles.root}>
        <Typography variant="h3" component="h1">
          Upcoming Events
        </Typography>
        {error && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {error.name}: {error.message}
            </Grid>
          </Grid>
        )}
        {!error && (
          <ProgressCardContent loading={loading}>
            <div className={styles.grid}>
              {data?.events.map((event) => (
                <Card key={event.id} className={styles.gridItem}>
                  <Typography gutterBottom variant="h5" component="h2">
                    <Link href={`/events/${event.id}`} passHref>
                      <a>{event.name}</a>
                    </Link>
                  </Typography>

                  {event.chapter.name}
                </Card>
              ))}
            </div>
          </ProgressCardContent>
        )}
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Link href="/dashboard">
            <Button variant="outlined">
              <a>Admin dashboard</a>
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
