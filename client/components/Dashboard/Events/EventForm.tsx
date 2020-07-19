import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import {
  IEventFormProps,
  fields,
  IField,
  IEventFormData,
} from './EventFormUtils';
import { IEventModal } from 'client/store/types/events';
import useFormStyles from '../shared/formStyles';

const formatValue = (field: IField, store?: IEventModal): any => {
  const { key } = field;

  if (!store || !Object.keys(store).includes(key)) {
    return field.defaultValue;
  }

  if (key.endsWith('_at')) {
    return new Date(store[field.key]).toISOString().slice(0, 16);
  }

  if (key === 'tags') {
    const tags = store[key];
    if (tags) {
      return tags.map(tag => tag.name).join(', ');
    }
  }

  return store[key];
};

const EventForm: React.FC<IEventFormProps> = ({
  onSubmit,
  loading,
  venues,
  venuesLoading,
  data,
  submitText,
}) => {
  const { control, handleSubmit } = useForm();
  const styles = useFormStyles();

  const [venueId, setVenueId] = useState<number | undefined>(0);

  useEffect(() => {
    const newValue = (data && data.venue) || (venues[0] && venues[0].id) || 0;

    setVenueId(newValue);
  }, [venuesLoading, venues, data]);

  return (
    <form
      onSubmit={handleSubmit(data => {
        const formData = data as Omit<IEventFormData, 'venue'>;
        onSubmit({ ...formData, venue: venueId });
      })}
      className={styles.form}
    >
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
            defaultValue={formatValue(field, data)}
            options={{ required: true }}
          />
        </FormControl>
      ))}
      {venuesLoading ? (
        <h1>Loading venues...</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="venue-label">Venue</InputLabel>
          <Select
            labelId="venue-label"
            required
            value={venueId}
            onChange={e => setVenueId(e.target.value as number)}
          >
            {venues.map(venue => (
              <MenuItem value={venue.id} key={venue.id}>
                {venue.name}
              </MenuItem>
            ))}
          </Select>
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

export default EventForm;
