import {
  Button,
  Checkbox,
  Container,
  Grid,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { add } from 'date-fns';

import { InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  useCalendarIntegrationStatusQuery,
  useChapterVenuesQuery,
  useDashboardChapterQuery,
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

interface IntegrationInfoData {
  isAuthenticated: boolean | null | undefined;
  hasCalendar: boolean;
}

const IntegrationInfo = ({
  isAuthenticated,
  hasCalendar,
}: IntegrationInfoData) => {
  const infoData = ({ isAuthenticated, hasCalendar }: IntegrationInfoData) => {
    if (isAuthenticated) {
      if (hasCalendar) {
        return {
          Icon: InfoIcon,
          text: 'Instance is authenticated with calendar api, and chapter has created calendar. Chapter will attempt creating event in the calendar.',
        };
      }
      return {
        Icon: WarningTwoIcon,
        text: "Instance is authenticated with calendar api, but chapter doesn't have calendar created. Event will not be created in the calendar.",
      };
    }

    const isBroken = isAuthenticated === null;
    if (isBroken) {
      if (hasCalendar) {
        return {
          Icon: WarningTwoIcon,
          text: 'Chapter has calendar created, but calendar integration is not working. Event will not be created in the calendar.',
        };
      }
      return {
        Icon: WarningTwoIcon,
        text: 'Calendar integration is not working, and chapter does not have calendar created. Event will not be created in calendar.',
      };
    }
    return {
      Icon: WarningTwoIcon,
      text: 'Instance is not authenticated with calendar api. Automatic creation of events in calendar is not possible.',
    };
  };

  const { Icon, text } = infoData({ isAuthenticated, hasCalendar });
  return (
    <Container>
      <Icon boxSize={5} marginRight={1} />
      {text}
    </Container>
  );
};

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

  const {
    loading: loadingChapter,
    error: errorChapter,
    data: dataChapter,
  } = useDashboardChapterQuery({ variables: { chapterId } });
  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery({ skip: !!data });

  const sponsorQuery = useSponsorsQuery();

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
          ) : errorChapter || !dataChapter?.dashboardChapter ? (
            <Text>Error loading chapter</Text>
          ) : (
            <Heading>{dataChapter.dashboardChapter.name}</Heading>
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

        {!data &&
          (loadingStatus || loadingChapter ? (
            <Spinner />
          ) : (
            <IntegrationInfo
              isAuthenticated={dataStatus?.calendarIntegrationStatus}
              hasCalendar={!!dataChapter?.dashboardChapter.has_calendar}
            />
          ))}

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
