import React, { useEffect } from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { SomeComponent, ProgressCardContent } from 'client/components';
import { AppStoreState } from 'client/store/reducers';
import { chapterActions } from 'client/store/actions';

const useStyles = makeStyles(() => ({
  root: {
    padding: 15,
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();

  const { error, loading, name, description } = useSelector(
    (state: AppStoreState) => ({
      error: state.chapter.error,
      loading: state.chapter.loading,
      name: state.chapter.name,
      description: state.chapter.description,
    }),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(chapterActions.fetchChapter('1'));
  }, []);

  return (
    <>
      <SomeComponent />
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={10}>
          {!error && (
            <Card>
              <ProgressCardContent loading={loading}>
                <Typography gutterBottom variant="h5" component="h2">
                  {name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {description}
                </Typography>
              </ProgressCardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
