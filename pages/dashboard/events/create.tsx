import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, TextField, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '25%',
  },
  item: {
    marginTop: '20px',
  },
}));

const CreateEvent: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const styles = useStyles();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormControl className={styles.item}>
          <Controller
            control={control}
            as={
              <TextField
                label="Event title"
                type="text"
                placeholder="Foo and the bars"
              />
            }
            name="name"
            defaultValue=""
            options={{ required: true }}
          />
        </FormControl>
        <FormControl className={styles.item}>
          <Controller
            control={control}
            as={<TextField label="Capacity" type="number" placeholder="50" />}
            name="capacity"
            defaultValue=""
            options={{ required: true }}
          />
        </FormControl>
        <FormControl className={styles.item}>
          <Controller
            control={control}
            as={
              <TextField
                label="Tags (separated by a comma)"
                type="text"
                placeholder="Foo, bar"
              />
            }
            name="tags"
            defaultValue=""
            options={{ required: true }}
          />
        </FormControl>
        <Button
          className={styles.item}
          variant="contained"
          color="primary"
          type="submit"
        >
          Add Event
        </Button>
      </form>
    </>
  );
};

export default CreateEvent;
