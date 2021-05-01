import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
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
import { useVenuesQuery } from '../../../../generated/graphql';
import { Input } from '../../../../components/Form/Input';
import { VStack } from '@chakra-ui/layout';

const EventForm: React.FC<EventFormProps> = (props) => {
  const { onSubmit, data, loading, submitText } = props;
  const {
    loading: loadingVenues,
    error: errorVenus,
    data: dataVenues,
  } = useVenuesQuery();

  const defaultValues = useMemo(
    () => ({
      ...(data || {}),
      tags: (data?.tags || []).map((t) => t.name).join(', '),
      venue: data?.venue?.id,
    }),
    [],
  );

  const { control, register, handleSubmit } = useForm<EventFormData>({
    defaultValues,
  });
  const styles = useFormStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <VStack>
        {fields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            isRequired
            isTextArea={field.type === 'textarea'}
            {...register(field.key)}
            defaultValue={formatValue(field, data)}
          />
        ))}
      </VStack>

      {loadingVenues ? (
        <h1>Loading venues...</h1>
      ) : errorVenus || !dataVenues ? (
        <h1>Error loading venues</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="venue-label">Venue</InputLabel>
          <Controller
            render={({ field }) => (
              <Select {...field} labelId="venue-label">
                {dataVenues.venues.map((venue) => (
                  <MenuItem value={venue.id} key={venue.id}>
                    {venue.name}
                  </MenuItem>
                ))}
                <MenuItem>None</MenuItem>
              </Select>
            )}
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
