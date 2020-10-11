import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import Layout from '../home/shared/components/Layout';

const SearchResults: React.FC = () => {
  // TODO: Replace with `useEventsQuery()`!
  const data = {
    searchResults: [],
    searchTerm: 'London',
  };

  return (
    <Layout>
      <h1>
        Search results for <q>{data?.searchTerm}</q>
      </h1>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          {data?.searchResults.length === 0 && (
            <Typography gutterButtom variant="p" component="p">
              Nothing found.
            </Typography>
          )}
          {data?.searchResults.map(searchResult => (
            <Card>
              <Typography gutterBottom variant="h5" component="h2">
                {searchResult}
              </Typography>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SearchResults;
