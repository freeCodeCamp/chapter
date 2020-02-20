import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Button, TextField, makeStyles, FormControl } from '@material-ui/core';
import { locationActions } from 'client/store/actions';
import { AppStoreState } from 'client/store/reducers';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '25%',
  },
  item: {
    marginTop: '20px',
  },
  responseDiv: {
    margin: '15px 0',
  },
}));

const NewLocation: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const { error, loading, done } = useSelector((state: AppStoreState) => ({
    error: state.locations.create.error,
    loading: state.locations.create.loading,
    done: state.locations.create.done,
  }));
  const dispatch = useDispatch();

  const onSubmit = async data => {
    await dispatch(locationActions.create(data));
  };

  useEffect(() => {
    if (done) {
      router.replace('/dashboard/locations');
    }
  }, [done]);

  const fields = ['country_code', 'city', 'region', 'postal_code', 'address'];

  return (
    <>
      {error && <div className={styles.responseDiv}>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {fields.map(item => (
          <FormControl className={styles.item} key={item}>
            <Controller
              control={control}
              as={
                <TextField
                  name={item}
                  type="text"
                  label={item}
                  placeholder=""
                />
              }
              name={item}
              options={{ required: item !== 'address' }}
            />
          </FormControl>
        ))}
        <Button
          className={styles.item}
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Add Location
        </Button>

        {loading && <h1>Loading...</h1>}
      </form>
    </>
  );
};

export default NewLocation;
