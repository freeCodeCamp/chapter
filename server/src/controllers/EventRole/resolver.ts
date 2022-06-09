import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { EventRole } from '../../graphql-types/EventUser';

@Resolver()
export class EventRoleResolver {
  @Query(() => [EventRole])
  async eventRoles(): Promise<EventRole[]> {
    return await prisma.event_roles.findMany({
      include: {
        event_role_permissions: { include: { event_permission: true } },
      },
    });
  }
}
