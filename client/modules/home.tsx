import React, { useEffect } from 'react';
import Link from 'next/link';
import { Card, Typography, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SomeComponent, ProgressCardContent } from 'client/components';
import { AppStoreState } from 'client/store/reducers';
import { chapterActions } from 'client/store/actions';
import useThunkDispatch from 'client/hooks/useThunkDispatch';

const Home: React.FC = () => {
  const { error, loading, name, description } = useSelector(
    (state: AppStoreState) => ({
      error: state.chapter.error,
      loading: state.chapter.loading,
      name: state.chapter.name,
      description: state.chapter.description,
    }),
  );
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(chapterActions.fetchChapter('1'));
  }, []);

  return (
    <>
      <SomeComponent />
      <Grid container spacing={2}>
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
