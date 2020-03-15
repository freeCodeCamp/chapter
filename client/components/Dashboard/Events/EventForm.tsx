import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
  TextField,
  Button,
  makeStyles,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { IVenueModal } from 'client/store/types/venues';

interface IField {
  key: string;
  label: string;
  placeholder?: string;
  type: string;
  defaultValue?: string;
}

const fields: IField[] = [
  {
    key: 'name',
    type: 'text',
    label: 'Event title',
    placeholder: 'Foo and the Bars',
  },
  {
    key: 'description',
    type: 'text',
    label: 'Description',
    placeholder: '',
  },
  {
    key: 'capacity',
    type: 'number',
    label: 'Capacity',
    placeholder: '50',
  },
  {
    key: 'tags',
    type: 'text',
    label: 'Tags (separated by a comma)',
    placeholder: 'Foo, bar',
  },
  {
    key: 'start_at',
    type: 'datetime-local',
    label: 'Start at',
    defaultValue: new Date().toISOString().slice(0, 16),
  },
  {
    key: 'ends_at',
    type: 'datetime-local',
    label: 'End at',
    defaultValue: new Date(Date.now() + 1000 * 60 * 60)
      .toISOString()
      .slice(0, 16),
  },
];

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

export interface IEventFormData {
  name: string;
  description: string;
  capacity: number;
  tags: string;
  venue: number;
}

interface IEventFormProps {
  onSubmit: (data: IEventFormData) => void;
  loading: boolean;
  venues: IVenueModal[];
  venuesLoading: boolean;
}

const EventForm: React.FC<IEventFormProps> = ({
  onSubmit,
  loading,
  venues,
  venuesLoading,
}) => {
  const { control, handleSubmit } = useForm();
  const styles = useStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map(field => (
        <FormControl className={styles.item} key={field.key}>
          <Controller
            control={control}
            as={
              <TextField
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
              />
            }
            name={field.key}
            defaultValue={field.defaultValue}
            options={{ required: true }}
          />
        </FormControl>
      ))}
      {venuesLoading ? (
        <h1>Loading venues...</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="venue-label">Venue</InputLabel>
          <Controller
            control={control}
            as={
              <Select labelId="venue-label">
                {venues.map(venue => (
                  <MenuItem value={venue.id} key={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
              </Select>
            }
            name="venue"
            options={{ required: true }}
            defaultValue={0}
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
        Add Event
      </Button>
    </form>
  );
};

export default EventForm;
