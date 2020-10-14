import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import Layout from '../home/shared/components/Layout';

const SearchResults: React.FC = () => {
  // TODO: Replace with `useEventsQuery()`!
  // TODO: Add `key` prop to `<Card />`!
  const data = {
    searchResults: [],
    searchTerm: 'London',
  };

  return (
    <Layout>
      <Typography variant="h1" component="h1">
        Search results for <q>{data?.searchTerm}</q>
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          {data?.searchResults.length === 0 && (
            <Typography variant="body1" component="p">
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
