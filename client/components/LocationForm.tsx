import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, makeStyles, FormControl } from '@material-ui/core';

const fields = ['country_code', 'city', 'region', 'postal_code', 'address'];

interface ILocationFormProps {
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
  data?: {
    country_code?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    address: string;
  };
}

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

const LocationForm: React.FC<ILocationFormProps> = props => {
  const { loading, onSubmit, data } = props;

  const styles = useStyles();
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map(item => (
        <FormControl className={styles.item} key={item}>
          <Controller
            control={control}
            as={
              <TextField name={item} type="text" label={item} placeholder="" />
            }
            name={item}
            options={{ required: item !== 'address' }}
            defaultValue={data && data[item]}
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
    </form>
  );
};

export default LocationForm;
