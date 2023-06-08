import { useCancelEventMutation } from '../generated/graphql';
import {
  DASHBOARD_EVENT,
  DASHBOARD_EVENTS,
} from '../modules/dashboard/Events/graphql/queries';
import {
  DATA_PAGINATED_EVENTS_TOTAL_QUERY,
  EVENT,
} from '../modules/events/graphql/queries';

export const useCancelEvent = () => {
  const [cancelEvent] = useCancelEventMutation();

  return async ({ eventId }: { eventId: number }) => {
    const { data, errors } = await cancelEvent({
      variables: { eventId },
      refetchQueries: [
        { query: DASHBOARD_EVENTS },
        { query: EVENT, variables: { eventId } },
        { query: DASHBOARD_EVENT, variables: { eventId } },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 2 },
        },
        {
          query: DATA_PAGINATED_EVENTS_TOTAL_QUERY,
          variables: { offset: 0, limit: 5, showOnlyUpcoming: false },
        },
      ],
    });
    if (errors) throw errors;

    return data;
  };
};
