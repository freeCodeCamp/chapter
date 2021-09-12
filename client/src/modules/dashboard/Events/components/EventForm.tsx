import {
  VStack,
  Checkbox,
  Button,
  FormLabel,
  FormControl,
  Select,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import { useVenuesQuery } from '../../../../generated/graphql';
import {
  EventFormProps,
  fields,
  formatValue,
  EventFormData,
} from './EventFormUtils';

const EventForm: React.FC<EventFormProps> = (props) => {
  const { onSubmit, data, loading, submitText } = props;
  const {
    loading: loadingVenues,
    error: errorVenus,
    data: dataVenues,
  } = useVenuesQuery();

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

  const { register, handleSubmit, watch, setValue } = useForm<EventFormData>({
    defaultValues,
  });
  const inviteOnly = watch('invite_only');

  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}
    >
      <VStack align="flex-start">
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

        <Checkbox
          data-cy="invite-only-checkbox"
          isChecked={inviteOnly}
          onChange={(e) => setValue('invite_only', e.target.checked)}
        >
          Invite only
        </Checkbox>

        {loadingVenues ? (
          <h1>Loading venues...</h1>
        ) : errorVenus || !dataVenues ? (
          <h1>Error loading venues</h1>
        ) : (
          <FormControl>
            <FormLabel>Venue</FormLabel>
            <Select {...register('venueId')}>
              {dataVenues.venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}

              <option>None</option>
            </Select>
          </FormControl>
        )}

        <Button
          width="100%"
          colorScheme="blue"
          type="submit"
          isDisabled={loading}
        >
          {submitText}
        </Button>
      </VStack>
    </form>
  );
};

export default EventForm;
