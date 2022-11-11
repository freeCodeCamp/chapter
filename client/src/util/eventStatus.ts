import { Event } from '../generated/graphql';

export enum EventStatus {
    canceled = 'Canceled',
    running = 'Running',
    ended = 'Ended at',
    upcoming = 'Upcoming',
  }

 export const getEventStatus = ({
    canceled,
    hasStarted,
    hasEnded,
  }: {
    canceled: boolean | ((event: Event)=>  boolean);
    hasStarted: boolean | ((event: Event)=> boolean);
    hasEnded: boolean | ((event: Event)=> boolean);
  }) => {
    if (canceled) return EventStatus.canceled;
    if (hasEnded) return EventStatus.ended;
    if (hasStarted) return EventStatus.running;
    return EventStatus.upcoming;
  };