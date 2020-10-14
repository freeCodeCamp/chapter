import React from 'react';
import Link from 'next/link';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import { ProgressCardContent } from '../../components';
import { useChaptersQuery } from '../../generated';

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
  const { loading, error, data } = useChaptersQuery();
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
              {data?.chapters.map(chapter => (
                <>
                  <Card className={styles.gridItem}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {chapter.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {chapter.description}
                    </Typography>
                  </Card>
                </>
              ))}
            </div>
          </ProgressCardContent>
        )}
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Link href="/add-sponsor">
            <Button variant="outlined">
              <a>Add sponsor</a>
            </Button>
          </Link>
        </Grid>

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
