import { Prisma, events } from '@prisma/client';
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Resolver,
  Query,
} from 'type-graphql';
import { AttendanceNames } from '../../../../common/attendance';
import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';

import {
  Venue,
  VenueWithChapter,
  VenueWithChapterEvents,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import mailerService from '../../services/MailerService';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { eventListUnsubscribeOptions } from '../../util/event-email';
import { VenueInputs } from './inputs';

@Resolver()
export class VenueResolver {
  @Query(() => [Venue])
  chapterVenues(
    @Arg('chapterId', () => Int) chapterId: number,
  ): Promise<Venue[]> {
    return prisma.venues.findMany({
      where: { chapter_id: chapterId },
      orderBy: { name: 'asc' },
    });
  }

  @Authorized(Permission.VenuesView)
  @Query(() => [VenueWithChapter])
  async dashboardVenues(
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<VenueWithChapter[]> {
    return await prisma.venues.findMany({
      include: { chapter: true },
      orderBy: { name: 'asc' },
      ...(!isAdminFromInstanceRole(ctx.user) && {
        where: { chapter: isChapterAdminWhere(ctx.user.id) },
      }),
    });
  }

  @Authorized(Permission.VenueEdit)
  @Query(() => VenueWithChapterEvents, { nullable: true })
  venue(
    @Arg('venueId', () => Int) id: number,
  ): Promise<VenueWithChapterEvents | null> {
    return prisma.venues.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            events: { where: { venue_id: id }, orderBy: { start_at: 'desc' } },
          },
        },
      },
    });
  }

  @Authorized(Permission.VenueCreate)
  @Mutation(() => Venue)
  async createVenue(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('data') data: VenueInputs,
  ): Promise<Venue> {
    const venueData: Prisma.venuesCreateInput = {
      ...data,
      chapter: { connect: { id: chapterId } },
    };
    return prisma.venues.create({
      data: venueData,
    });
  }

  @Authorized(Permission.VenueEdit)
  @Mutation(() => Venue)
  updateVenue(
    @Arg('id', () => Int) id: number,
    @Arg('_onlyUsedForAuth', () => Int) _onlyUsedForAuth: number,
    @Arg('data') data: VenueInputs,
  ): Promise<Venue | null> {
    const venueData: Prisma.venuesUpdateInput = data;
    return prisma.venues.update({
      where: { id },
      data: venueData,
    });
  }

  @Authorized(Permission.VenueDelete)
  @Mutation(() => Venue)
  async deleteVenue(
    @Arg('id', () => Int) id: number,
    @Arg('_onlyUsedForAuth', () => Int) _onlyUsedForAuth: number,
  ): Promise<{ id: number }> {
    // TODO: handle deletion of non-existent venue
    const users = await prisma.users.findMany({
      where: {
        user_events: {
          some: {
            event: {
              canceled: false,
              ends_at: { gt: new Date() },
              venue_id: id,
            },
            subscribed: true,
            attendance: { name: AttendanceNames.confirmed },
          },
        },
      },
      include: {
        user_events: {
          include: { event: true },
          where: {
            event: {
              canceled: false,
              ends_at: { gt: new Date() },
              venue_id: id,
            },
            subscribed: true,
            attendance: { name: AttendanceNames.confirmed },
          },
        },
      },
    });

    const venue = await prisma.venues.findUniqueOrThrow({
      where: { id: id },
    });

    const eventList = (event: events[], currentUserId: number) =>
      event.map(
        ({ name, id }) => `
      <tr>
        <td>${name}</td>
        <td>${eventListUnsubscribeOptions({
          eventId: id,
          userId: currentUserId,
        })}</td>
      </tr>
      `,
      );
    const emailSubject = `Events hosted at ${venue.name} won't be hosted there anymore`;
    const emailContent = (
      event: events[],
      currentUserId: number,
    ) => `The events related to ${
      venue.name
    } won't be host locally anymore.<br />
  <table>
    <thead>
        <tr>
          <th>Event</th>
          <th>Action</th>
        </tr>
    </thead>
    <tbody>
      ${eventList(event, currentUserId).join('')}
    </tbody>
  </table>`;

    for (const { email, id: currentUserId, user_events } of users) {
      const events = user_events.map(({ event }) => event);
      mailerService.sendEmail({
        emailList: [email],
        subject: emailSubject,
        htmlEmail: emailContent(events, currentUserId),
      });
    }

    await prisma.venues.update({
      where: { id: id },
      data: { events: { set: [] } },
    });
    return await prisma.venues.delete({
      where: { id },
    });
  }
}
