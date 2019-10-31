import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
const SomeComponent = () => (
  <Grid container>
    <Grid item xs={12}>
      This is an imported component with a Button
    </Grid>
    <Button variant="outlined">CLick Here!</Button>
  </Grid>
);

export default SomeComponent;
