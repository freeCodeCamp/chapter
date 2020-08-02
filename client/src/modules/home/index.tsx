import React from 'react';
import Link from 'next/link';
import { Card, Typography, Grid } from '@material-ui/core';

import { ProgressCardContent } from '../../components';
import { useChaptersQuery } from '../../generated';

const Home: React.FC = () => {
  const { loading, error, data } = useChaptersQuery();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          {!error && (
            <Card>
              <ProgressCardContent loading={loading}>
                {data?.chapters.map(chapter => (
                  <>
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
                  </>
                ))}
              </ProgressCardContent>
            </Card>
          )}
        </Grid>
      </Grid>
      <Link href="/add-sponsor">
        <a>Add sponsor</a>
      </Link>
      <br />
      <Link href="/dashboard">
        <a>Admin dashboard</a>
      </Link>
    </>
  );
};

export default Home;
