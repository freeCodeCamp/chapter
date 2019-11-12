import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { IStateProps, IDispatchProps } from 'client/containers/home';
import { SomeComponent } from 'client/components';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    padding: 15,
  },
}));

const Home: React.FC<IStateProps & IDispatchProps> = props => {
  const classes = useStyles();
  useEffect(() => {
    props.fetch('1');
  }, [props.name]);

  return (
    <>
      <SomeComponent />
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={10}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {props.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {props.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
