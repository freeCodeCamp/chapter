import { useRouter } from 'next/router';
import { isFuture } from 'date-fns';

import {
  useCreateEventMutation,
  useJoinChapterMutation,
  useSendEventInviteMutation,
} from '../generated/graphql';
import { useUser } from '../modules/auth/user';
import { CHAPTER } from '../modules/chapters/graphql/queries';
import {
  EventFormData,
  parseEventData,
} from '../modules/dashboard/Events/components/EventFormUtils';
import { DASHBOARD_EVENTS } from '../modules/dashboard/Events/graphql/queries';
import { DATA_PAGINATED_EVENTS_TOTAL_QUERY } from '../modules/events/graphql/queries';
import { useAlert } from './useAlert';

interface CreateEventData {
  data: EventFormData;
  success: (eventName: string) => string;
}

export const useCreateEvent = () => {
  const router = useRouter();
  const { user } = useUser();
  const addAlert = useAlert();

  const [createEvent] = useCreateEventMutation();
  const [joinChapter] = useJoinChapterMutation();
  const [publish] = useSendEventInviteMutation();

  return async ({ data, success }: CreateEventData) => {
    const { chapter_id, attend_event } = data;
    const { data: createData, errors: createErrors } = await createEvent({
      variables: {
        chapterId: chapter_id,
        data: parseEventData(data),
        attendEvent: attend_event ?? false,
      },
      refetchQueries: [
        { query: CHAPTER, variables: { chapterId: chapter_id } },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 2 },
        },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
        },
        {
          query: DASHBOARD_EVENTS,
        },
      ],
    });

    if (createErrors) throw createErrors;

    if (createData) {
      if (attend_event) joinChapter({ variables: { chapterId: chapter_id } });
      if (isFuture(data.start_at)) {
        await publish({ variables: { eventId: createData.createEvent.id } });
      }
      await router.replace(
        `/dashboard/events/[id]`,
        `/dashboard/events/${createData.createEvent.id}`,
      );
      addAlert({
        title: success(createData.createEvent.name),
        status: 'success',
      });

      const hasChapterCalendar = user?.admined_chapters.find(
        ({ id }) => id === chapter_id,
      )?.has_calendar;
      if (hasChapterCalendar && !createData.createEvent.has_calendar_event) {
        addAlert({
          title: 'Calendar event was not created.',
          status: 'warning',
        });
      }
    }
  };
};
