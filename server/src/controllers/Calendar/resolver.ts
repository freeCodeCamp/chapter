import { Authorized, Resolver, Query } from 'type-graphql';

import { prisma } from '../../prisma';
import { TokenStatus } from '../../graphql-types';
import { integrationStatus } from '../../util/calendar';
import { Permission } from '../../../../common/permissions';

@Resolver()
export class CalendarResolver {
  @Query(() => Boolean, { nullable: true })
  async calendarIntegrationStatus(): Promise<boolean | null> {
    return await integrationStatus();
  }

  @Authorized(Permission.GoogleAuthenticate)
  @Query(() => [TokenStatus])
  async tokenStatuses(): Promise<TokenStatus[]> {
    const statuses = await prisma.google_tokens.findMany({
      select: { email: true, is_valid: true },
    });
    const replacer = (
      _match: string,
      firstLetter: string,
      middle: string,
      lastLetterWithDomain: string,
    ) => `${firstLetter}${middle.replace(/./g, '*')}${lastLetterWithDomain}`;
    const statusesWithRedactedEmail = statuses.map((status) => {
      const { email } = status;
      const redactedEmail = email.replace(/^(.)(.*)(.@.*)$/, replacer);
      return { ...status, email: redactedEmail };
    });
    return statusesWithRedactedEmail;
  }
}
