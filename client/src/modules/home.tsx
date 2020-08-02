import React from 'react';
import Link from 'next/link';
import { Card, Typography, Grid } from '@material-ui/core';
// import { useSelector } from 'react-redux';
import { SomeComponent, ProgressCardContent } from '../components';
// import { AppStoreState } from '../store/reducers';
// import { chapterActions } from '../store/actions';
// import useThunkDispatch from '../hooks/useThunkDispatch';

const Home: React.FC = () => {
  // const { error, loading, name, description } = useSelector(
  //   (state: AppStoreState) => ({
  //     error: state.chapter.error,
  //     loading: state.chapter.loading,
  //     name: state.chapter.name,
  //     description: state.chapter.description,
  //   }),
  // );
  // const dispatch = useThunkDispatch();

  // useEffect(() => {
  //   dispatch(chapterActions.fetchChapter('1'));
  // }, []);

  return (
    <>
      <SomeComponent />
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Card>
            <ProgressCardContent loading={false}>
              <Typography gutterBottom variant="h5" component="h2">
                Hello
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                World
              </Typography>
            </ProgressCardContent>
          </Card>
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
