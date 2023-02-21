import { Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';
import { TokenStatus } from '../../graphql-types';
import { integrationStatus } from '../../util/calendar';
import { Permission } from '../../../../common/permissions';
import { testTokens } from '../../services/Google';

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
      const { email, ...rest } = status;
      const redactedEmail = email.replace(/^(.)(.*)(.@.*)$/, replacer);
      return { ...rest, redacted_email: redactedEmail };
    });
    return statusesWithRedactedEmail;
  }

  @Authorized(Permission.GoogleAuthenticate)
  @Mutation(() => Boolean, { nullable: true })
  async calendarIntegrationTest(): Promise<boolean | null> {
    await testTokens();
    return await integrationStatus();
  }
}
