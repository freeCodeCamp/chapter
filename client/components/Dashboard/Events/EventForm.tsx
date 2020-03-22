import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { IEventFormProps, fields, IField } from './EventFormUtils';
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
  const { control, handleSubmit, setValue } = useForm();
  const styles = useFormStyles();

  useEffect(() => {
    if (!venuesLoading && data) {
      setValue('venue', data.venue);
    }
  }, [venuesLoading]);

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
            defaultValue={
              (data && data.venue) || venues.length > 0
                ? venues[0] && venues[0].id
                : undefined
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

export default EventForm;
