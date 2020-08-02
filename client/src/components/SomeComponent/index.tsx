import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { withTheme, makeStyles } from '@material-ui/core/styles';

// You can also easily modify material-ui components
const useStyles = makeStyles(({ palette: { background, secondary } }) => ({
  grid: {
    background: background.default,
    color: secondary.main,
  },
}));

const SomeComponent = () => {
  const styles = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} className={styles.grid}>
        This is an imported component with a Button
      </Grid>
      <Button variant="outlined">CLick Here!</Button>
    </Grid>
  );
};

export default withTheme(SomeComponent);
