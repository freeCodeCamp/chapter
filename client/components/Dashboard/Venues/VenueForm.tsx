import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  TextField,
  makeStyles,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';

import { ILocationModal } from 'client/store/types/locations';
import getLocationString from 'client/helpers/getLocationString';
import { IVenueModal } from 'client/store/types/venues';

interface IData {
  name: string;
  location: number;
}

interface IVenueFormProps {
  loading: boolean;
  onSubmit: (data: IData) => Promise<void>;
  data?: IVenueModal;
  locations: ILocationModal[];
  locationsLoading: boolean;
  submitText: string;
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

const VenueForm: React.FC<IVenueFormProps> = props => {
  const {
    loading,
    onSubmit,
    data,
    locations,
    locationsLoading,
    submitText,
  } = props;

  const styles = useStyles();
  const { control, handleSubmit } = useForm();

  console.log(data && data.location && data.location.id);
  console.log(locations[0] && locations[0].id);

  // useEffect(() => {
  //   if (!locationsLoading && locations && data && data.location) {
  //     console.log(data.location.id);
  //     setValue('location', data.location.id);
  //   }
  // }, [locationsLoading, locations, data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormControl className={styles.item}>
        <Controller
          control={control}
          as={<TextField name="name" type="text" label="Name" placeholder="" />}
          name={'name'}
          options={{ required: true }}
          defaultValue={(data && data.name) || ''}
        />
      </FormControl>
      {locationsLoading ? (
        <h1>Loading locations...</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="location-label">Location</InputLabel>
          <Controller
            control={control}
            as={
              <Select labelId="location-label">
                {locations.map(location => (
                  <MenuItem value={location.id} key={location.id}>
                    {getLocationString(location, true)}
                  </MenuItem>
                ))}
              </Select>
            }
            name="location"
            options={{ required: true }}
            defaultValue={
              (data && data.location && data.location.id) ||
              (locations[0] && locations[0].id) ||
              0
            }
          />
        </FormControl>
      )}
      <Button
        className={styles.item}
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default VenueForm;
