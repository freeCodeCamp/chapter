import { Resolver, Query } from 'type-graphql';

import { integrationStatus } from '../../util/calendar';

@Resolver()
export class CalendarResolver {
  @Query(() => Boolean, { nullable: true })
  async calendarIntegrationStatus(): Promise<boolean | null> {
    return await integrationStatus();
  }
}
