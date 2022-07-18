/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import '@cypress/code-coverage/support';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Delete event using GQL mutation
       * @param eventId Id of the event for deletion
       */
      deleteEvent(eventId: number): Chainable<any>;

      /**
       * Check if mail recipients are bcc
       * @param mail The sent mail of type Item(cypress-mailhog)
       */
      checkBcc(mail): Chainable<boolean>;

      /**
       * Create chapter using GQL mutation
       * @param data Data of the chapter. Equivalent of CreateChapterInputs for the Chapter resolver.
       */
      createChapter(data): Chainable<any>;

      /**
       * Update chapter using GQL mutation
       * @param chapterId Id of the chapter
       * @param data Data of the chapter. Equivalent of UpdateChapterInputs for the Chapter resolver.
       */
      updateChapter(chapterId: number, data): Chainable<any>;

      /**
       * Confirm rsvp of user with userId for the event with eventId
       * @param eventId Id of the event
       * @param userId Id of the user
       */
      confirmRsvp(eventId: number, userId: number): Chainable<any>;

      /**
       * Delete rsvp of user with userId for the event with eventId
       * @param eventId Id of the event
       * @param userId Id of the user
       */
      deleteRsvp(eventId: number, userId: number): Chainable<any>;

      /**
       * Rsvp to event with eventId and chapterId
       * @param eventId Id of the event
       * @param chapterId Id of the chapter
       * @param {object} [options={ withAuth: boolean }] Optional options object.
       */
      rsvpToEvent(
        { eventId, chapterId }: { eventId: number; chapterId: number },
        options?: { withAuth: boolean },
      ): Chainable<any>;

      /**
       * Auth request, with token of the logged in user, before sending it.
       * @param options Request options
       */
      authedRequest(options): Chainable<any>;

      /**
       * Create sponsor using GQL mutation
       * @param data Data of the sponsor. Equivalent of CreateSponsorInputs for the Sponsor resolver.
       */
      createSponsor(data): Chainable<any>;

      /**
       * Update sponsor using GQL mutation
       * @param id Sponsor id
       * @param data Data of the sponsor. Equivalent of UpdateSponsorInputs for the Sponsor resolver.
       */
      updateSponsor(id: number, data): Chainable<any>;

      /**
       * Subscribe to notifications for a single event
       * @param eventId Id of the event
       * @param {object} [options={ withAuth: true }] Optional options object.
       */
      subscribeToEvent(
        { eventId }: { eventId: number },
        options?: { withAuth: boolean },
      ): Chainable<any>;

      /**
       * Unsubscribe from notifications for a single event
       * @param eventId Id of the event
       * @param {object} [options={ withAuth: true }] Optional options object.
       */
      unsubscribeFromEvent(
        { eventId }: { eventId: number },
        options?: { withAuth: boolean },
      ): Chainable<any>;

      /**
       * Get events for chapter using GQL query
       * @param id Chapter id
       */
      getChapterEvents(id: number): Chainable<any>;

      /**
       * Create venue using GQL mutation
       * @param chapterId Id of the chapter
       * @param data Data of the venue. Equivalent of CreateVenueInputs for the Venue resolver.
       * @param {object} [options={ withAuth: true }] Optional options object.
       */
      createVenue(
        { chapterId }: { chapterId: number },
        data: any,
        options?: { withAuth: boolean },
      ): Chainable<any>;

      /**
       * Update venue using GQL mutation
       * @param chapterId Id of the chapter
       * @param venueId Id of the venue
       * @param data Data of the venue. Equivalent of UpdateVenueInputs for the Venue resolver.
       * @param {object} [options={ withAuth: true }] Optional options object.
       */
      updateVenue(
        { venueId, chapterId }: { venueId: number; chapterId: number },
        data: any,
        options?: { withAuth: boolean },
      ): Chainable<any>;

      /**
       * Delete venue using GQL mutation
       * @param chapterId Id of the chapter
       * @param venueId Id of the venue
       * @param {object} [options={ withAuth: true }] Optional options object.
       */
      deleteVenue(
        { venueId, chapterId }: { venueId: number; chapterId: number },
        options?: { withAuth: boolean },
      ): Chainable<any>;
    }
  }
}
