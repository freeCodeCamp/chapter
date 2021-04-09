import React, { useMemo } from 'react';
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
  EventFormProps,
  fields,
  formatValue,
  EventFormData,
} from './EventFormUtils';
import useFormStyles from '../../shared/components/formStyles';
import { useVenuesQuery } from '../../../../generated';

const EventForm: React.FC<EventFormProps> = props => {
  const { onSubmit, data, loading, submitText } = props;
  const {
    loading: loadingVenues,
    error: errorVenus,
    data: dataVenues,
  } = useVenuesQuery();

  const defaultValues = useMemo(
    () => ({
      ...(data || {}),
      tags: (data?.tags || []).map(t => t.name).join(', '),
      venue: data?.venue?.id,
    }),
    [],
  );

  const { control, handleSubmit } = useForm<EventFormData>({ defaultValues });
  const styles = useFormStyles();

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
      {loadingVenues ? (
        <h1>Loading venues...</h1>
      ) : errorVenus || !dataVenues ? (
        <h1>Error loading venues</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="venue-label">Venue</InputLabel>
          <Controller
            as={
              <Select labelId="venue-label">
                {dataVenues.venues.map(venue => (
                  <MenuItem value={venue.id} key={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
                <MenuItem>None</MenuItem>
              </Select>
            }
            name="venueId"
            control={control}
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
