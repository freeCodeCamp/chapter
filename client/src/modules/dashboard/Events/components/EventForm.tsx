import { Button, Checkbox, Heading, HStack, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { add } from 'date-fns';

import {
  useChapterQuery,
  useChapterVenuesQuery,
  useSponsorsQuery,
  VenueType,
} from '../../../../generated/graphql';

import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import { Form } from '../../../../components/Form/Form';
import EventChapterSelect from './EventChapterSelect';
import EventDatesForm from './EventDatesForm';
import EventCancelButton from './EventCancelButton';
import EventSponsorsForm from './EventSponsorsForm';
import EventVenueForm from './EventVenueForm';
import { EventFormProps, fields, EventFormData } from './EventFormUtils';

const fieldTypeToComponent = (type: string) => {
  if (type === 'textarea') {
    return TextArea;
  }
  return Input;
};

const EventForm: React.FC<EventFormProps> = (props) => {
  const {
    onSubmit,
    data,
    loading,
    submitText,
    chapterId: initialChapterId,
    loadingText,
  } = props;
  const isChaptersDropdownNeeded = initialChapterId === -1;
  const {
    loading: loadingChapter,
    error: errorChapter,
    data: dataChapter,
  } = useChapterQuery({
    variables: { chapterId: initialChapterId },
  });

  const sponsorQuery = useSponsorsQuery();

  const defaultValues = useMemo(() => {
    if (!data) {
      return {
        start_at: add(new Date(), { days: 1 }),
        ends_at: add(new Date(), { days: 1, minutes: 30 }),
        venue_type: VenueType.PhysicalAndOnline,
        chapter_id: initialChapterId,
      };
    }
    return {
      name: data.name,
      description: data.description,
      streaming_url: data.streaming_url,
      capacity: data.capacity,
      start_at: new Date(data.start_at),
      ends_at: new Date(data.ends_at),
      sponsors: data.sponsors,
      venue_type: data.venue_type,
      venue_id: data.venue_id,
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

  const chapterVenuesQuery = useChapterVenuesQuery({
    variables: { chapterId },
  });

  return (
    <FormProvider {...formMethods}>
      <Form submitLabel={submitText} FormHandling={handleSubmit(onSubmit)}>
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
        <HStack width="100%" mb="10 !important">
          <Button
            width="full"
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
              isFullWidth={true}
              event={data}
              isDisabled={loading}
              buttonText="Cancel this Event"
            />
          )}
        </HStack>
      </Form>
    </FormProvider>
  );
};

export default EventForm;
