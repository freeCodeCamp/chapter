import { Button, Checkbox, Grid, Heading, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { add } from 'date-fns';

import {
  useChapterVenuesQuery,
  useSponsorsQuery,
  VenueType,
} from '../../../../generated/graphql';

import { AttendanceNames } from '../../../../../../common/attendance';
import { fieldTypeToComponent } from '../../../util/form';
import { Form } from '../../../../components/Form/Form';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import { Input } from '../../../../components/Form/Input';
import EventChapterSelect from './EventChapterSelect';
import EventDatesForm from './EventDatesForm';
import EventCancelButton from './EventCancelButton';
import EventSponsorsForm from './EventSponsorsForm';
import EventVenueForm from './EventVenueForm';
import {
  EventFormProps,
  fields,
  EventFormData,
  resolver,
  IEventData,
} from './EventFormUtils';

const minCapacity = (event?: IEventData) => {
  return (
    event?.event_users?.filter(
      ({ attendance: { name } }) => name === AttendanceNames.confirmed,
    ).length ?? 0
  );
};

const EventForm: React.FC<EventFormProps> = ({
  chapter,
  data,
  formType,
  header,
  loadingText,
  onSubmit,
  submitText,
}) => {
  const displayChaptersDropdown =
    typeof chapter === 'undefined' || formType === 'transfer';

  const sponsorQuery = useSponsorsQuery();

  const defaultValues = useMemo(() => {
    if (!data) {
      const date = new Date();
      return {
        venue_type: VenueType.PhysicalAndOnline,
        venue_id: 0,
        chapter_id: chapter?.id,
        start_at: add(date, { days: 1 }),
        ends_at: add(date, { days: 1, minutes: 30 }),
        attend_event: true,
      };
    }
    return {
      name: data.name,
      description: data.description,
      event_tags: (data.event_tags || [])
        .map(({ tag: { name } }) => name)
        .join(', '),
      url: data.url ?? '',
      streaming_url: data.streaming_url ?? '',
      capacity: data.capacity,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      sponsors: data.sponsors,
      venue_type: data.venue_type,
      venue_id: formType === 'transfer' ? 0 : data.venue_id,
      image_url: data.image_url,
      invite_only: data.invite_only,
      chapter_id: chapter?.id,
      attendees:
        data.event_users?.filter(
          ({ attendance: { name } }) => name === AttendanceNames.confirmed,
        ).length ?? 0,
      attend_event: true,
    };
  }, []);

  const formMethods = useForm<EventFormData>({
    defaultValues,
    mode: 'all',
    resolver,
  });
  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
    watch,
  } = formMethods;

  const inviteOnly = watch('invite_only');
  const chapterId = watch('chapter_id');

  const chapterVenuesQuery = useChapterVenuesQuery(
    !chapterId ? { skip: true } : { variables: { chapterId } },
  );

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<EventFormData>({
      onSubmit,
    });

  return (
    <FormProvider {...formMethods}>
      <Form
        submitLabel={submitText}
        FormHandling={handleSubmit(disableWhileSubmitting)}
      >
        <Heading>{header}</Heading>
        {chapter && (
          <Text fontSize={['md', 'lg', 'xl']}>Chapter: {chapter?.name}</Text>
        )}
        {displayChaptersDropdown && (
          <EventChapterSelect chapter={chapter} loading={loading} />
        )}
        {fields.map(({ isRequired, key, label, placeholder, type }) => {
          const Component = fieldTypeToComponent(type);
          const error = errors[key]?.message;
          return (
            <Component
              key={key}
              type={type}
              label={label}
              placeholder={placeholder}
              isRequired={isRequired}
              isDisabled={loading}
              error={error}
              {...register(key, {
                ...(type === 'number' && { valueAsNumber: true }),
              })}
            />
          );
        })}

        <EventDatesForm
          endsAt={defaultValues.ends_at}
          loading={loading}
          newEvent={!data}
          startAt={defaultValues.start_at}
        />

        <Grid as="fieldset" width="100%" gap="4">
          <Text srOnly as="legend">
            Attendee restrictions
          </Text>
          <Input
            key="capacity"
            type="number"
            label="Capacity"
            isRequired={true}
            isDisabled={loading}
            error={errors['capacity']?.message}
            {...register('capacity', { valueAsNumber: true })}
            min={minCapacity(data)}
          />
          <Checkbox
            data-cy="invite-only-checkbox"
            isChecked={inviteOnly}
            disabled={loading}
            {...register('invite_only')}
          >
            Invite only
          </Checkbox>
        </Grid>

        <EventVenueForm
          venueId={defaultValues.venue_id}
          loading={loading}
          chapterVenuesQuery={chapterVenuesQuery}
        />

        <EventSponsorsForm loading={loading} sponsorsQuery={sponsorQuery} />

        {data?.canceled && <Text color="red.500">Event canceled</Text>}

        {['new', 'transfer'].includes(formType) && (
          <Grid as="fieldset" width="100%">
            <Text srOnly as="legend">
              Your interaction with the event
            </Text>
            <Checkbox
              defaultChecked={true}
              disabled={loading}
              {...register('attend_event')}
            >
              Attend Event
            </Checkbox>
          </Grid>
        )}

        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(13rem, 1fr))"
          width="100%"
          gap="1em"
        >
          <Button
            colorScheme="blue"
            type="submit"
            isDisabled={!isDirty || loading || !isValid}
            isLoading={loading}
            loadingText={loadingText}
          >
            {submitText}
          </Button>
          {formType === 'edit' && data && !data.canceled && (
            <EventCancelButton
              event={data}
              isDisabled={loading}
              buttonText="Cancel this Event"
            />
          )}
        </Grid>
      </Form>
    </FormProvider>
  );
};

export default EventForm;
