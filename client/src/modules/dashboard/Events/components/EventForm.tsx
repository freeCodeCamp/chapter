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
import { useTagsQuery, useVenuesQuery } from '../../../../generated/graphql';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import { VStack } from '@chakra-ui/layout';

const EventForm: React.FC<EventFormProps> = (props) => {
  const { onSubmit, data, loading, submitText } = props;
  const {
    loading: loadingVenues,
    error: errorVenus,
    data: dataVenues,
  } = useVenuesQuery();

  const {
    loading: loadingTags,
    error: errorTags,
    data: dataTags,
  } = useTagsQuery();

  const defaultValues = useMemo(() => {
    if (!data) return {};
    return {
      name: data.name,
      description: data.description,
      url: data.url,
      video_url: data.video_url,
      capacity: data.capacity,
      start_at: data.start_at,
      ends_at: data.ends_at,
      tags: (data.tags || []).map((t) => t.name).join(', '),
      venueId: data.venueId,
    };
  }, []);

  const { control, register, handleSubmit } = useForm<EventFormData>({
    defaultValues,
  });
  const styles = useFormStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <VStack>
        {fields.map((field) =>
          field.type === 'textarea' ? (
            <TextArea
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              isRequired
              {...register(field.key)}
              defaultValue={formatValue(field, data)}
            />
          ) : (
            <Input
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              isRequired
              {...register(field.key)}
              defaultValue={formatValue(field, data)}
            />
          ),
        )}
      </VStack>

      {loadingTags ? (
        <h1>Loading tags...</h1>
      ) : errorTags || !dataTags ? (
        <h1>Error loading tags</h1>
      ) : (
        <FormControl className={styles.item}>
          <InputLabel id="tag-label">Tag</InputLabel>
          <Controller
            render={({ field }) => (
              <Select {...field} labelId="tag-label">
                {dataTags.tags.map((tag) => (
                  <MenuItem value={tag.id} key={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
                <MenuItem>None</MenuItem>
              </Select>
            )}
            name="tagIds"
            control={control}
          />
        </FormControl>
      )}

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
