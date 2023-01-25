import { Button, Checkbox, Heading, Grid, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { add } from 'date-fns';

import {
  useChapterQuery,
  useChapterVenuesQuery,
  useSponsorsQuery,
  VenueType,
} from '../../../../generated/graphql';

import { fieldTypeToComponent } from '../../../util/form';
import { Form } from '../../../../components/Form/Form';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import EventChapterSelect from './EventChapterSelect';
import EventDatesForm from './EventDatesForm';
import EventCancelButton from './EventCancelButton';
import EventSponsorsForm from './EventSponsorsForm';
import EventVenueForm from './EventVenueForm';
import { EventFormProps, fields, EventFormData } from './EventFormUtils';

const EventForm: React.FC<EventFormProps> = (props) => {
  const {
    onSubmit,
    data,
    submitText,
    chapterId: initialChapterId,
    loadingText,
    formType,
  } = props;
  const isChaptersDropdownNeeded = typeof initialChapterId === 'undefined';

  const queryOptions = isChaptersDropdownNeeded
    ? { skip: true }
    : { variables: { chapterId: initialChapterId } };

  const {
    loading: loadingChapter,
    error: errorChapter,
    data: dataChapter,
  } = useChapterQuery(queryOptions);

  const sponsorQuery = useSponsorsQuery();

  const defaultValues = useMemo(() => {
    if (!data) {
      const date = new Date();
      return {
        venue_type: VenueType.PhysicalAndOnline,
        venue_id: 0,
        chapter_id: initialChapterId,
        start_at: add(date, { days: 1 }),
        ends_at: add(date, { days: 1, minutes: 30 }),
      };
    }
    return {
      name: data.name,
      description: data.description,
      streaming_url: data.streaming_url ?? '',
      capacity: data.capacity,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      sponsors: data.sponsors,
      venue_type: data.venue_type,
      venue_id: data.venue_id ?? 0,
      image_url: data.image_url,
      invite_only: data.invite_only,
      chapter_id: initialChapterId,
    };
  }, []);

  const formMethods = useForm<EventFormData>({
    defaultValues,
  });
  const {
    formState: { isDirty },
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
        {!isChaptersDropdownNeeded || data ? (
          loadingChapter ? (
            <Text>Loading Chapter</Text>
          ) : errorChapter || !dataChapter?.chapter ? (
            <Text>Error loading chapter</Text>
          ) : (
            <Heading>{dataChapter.chapter.name}</Heading>
          )
        ) : (
          <EventChapterSelect loading={loading} />
        )}
        {fields.map(({ isRequired, key, label, placeholder, type }) => {
          const Component = fieldTypeToComponent(type);
          return (
            <Component
              key={key}
              type={type}
              label={`${label}${isRequired ? ' (Required)' : ''}`}
              placeholder={placeholder}
              isRequired={isRequired}
              isDisabled={loading}
              {...register(key)}
            />
          );
        })}

        <EventDatesForm
          endsAt={defaultValues.ends_at}
          loading={loading}
          newEvent={!data}
          startAt={defaultValues.start_at}
        />

        <Checkbox
          data-cy="invite-only-checkbox"
          isChecked={inviteOnly}
          disabled={loading}
          {...register('invite_only')}
        >
          Invite only
        </Checkbox>

        <EventVenueForm
          venueId={defaultValues.venue_id}
          loading={loading}
          chapterVenuesQuery={chapterVenuesQuery}
        />

        <EventSponsorsForm loading={loading} sponsorsQuery={sponsorQuery} />

        {data?.canceled && <Text color="red.500">Event canceled</Text>}

        {formType === 'new' && (
          <Checkbox
            defaultChecked={true}
            disabled={loading}
            {...register('attend_event')}
          >
            Attend Event
          </Checkbox>
        )}

        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(13rem, 1fr))"
          width="100%"
          gap="1em"
        >
          <Button
            colorScheme="blue"
            type="submit"
            isDisabled={!isDirty || loading}
            isLoading={loading}
            loadingText={loadingText}
          >
            {submitText}
          </Button>
          {data && !data.canceled && (
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
