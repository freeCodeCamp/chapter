import { expectToBeRejected } from '../../../../support/util';
import type { ChapterMembers } from '../../../../../cypress.config';
import { VenueType } from '../../../../../client/src/generated/graphql';

// no url string to confirm that it is not required
const testEvent = {
  name: 'Test Event',
  description: 'Test Description',
  streaming_url: 'https://test.event.org/video',
  capacity: '10',
  tags: 'Test, Event, Tag',
  start_at: '2022-01-01T00:01',
  ends_at: '2022-01-02T00:02',
  venue_id: '1',
  image_url: 'https://test.event.org/image',
};

const eventData = {
  ...testEvent,
  capacity: 10,
  venue_id: 1,
  tags: ['Test', 'Event', 'Tag'],
  sponsor_ids: [],
  name: 'Other Event',
  url: 'https://test.event.org',
  venue_type: VenueType.PhysicalAndOnline,
  invite_only: false,
};

describe('chapter dashboard', () => {
  beforeEach(() => {
    cy.task('seedDb');
    cy.login('admin@of.chapter.one');
    cy.mhDeleteAll();
  });

  it('should have link to add event for chapter', () => {
    cy.visit('/dashboard/chapters/1');
    cy.get('a[href="/dashboard/chapters/1/new-event"').should('be.visible');
  });

  it('emails interested users when an event is created', () => {
    createEventViaUI(1);
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
    // confirm that the test data appears in the new event
    Object.entries(testEvent).forEach(([key, value]) => {
      // TODO: simplify this conditional when tags and dates are handled
      // properly.
      if (!['tags', 'start_at', 'ends_at', 'venue_id'].includes(key)) {
        cy.contains(value);
      }
    });
    // check that the title we selected is in the event we created.

    // The type has to be set, since TS can't infer that the alias is to a
    // string
    cy.get<string>('@venueTitle').then((venueTitle) => {
      cy.contains(venueTitle);
    });

    // TODO: select chapter during event creation and use that here (much like @venueTitle
    // ) i.e. remove the hardcoding.
    cy.task<ChapterMembers>('getChapterMembers', 1).then((members) => {
      const subscriberEmails = members
        .filter(({ subscribed }) => subscribed)
        .map(({ user: { email } }) => email);

      // check that the subscribed users have been emailed
      cy.waitUntilMail({
        expectedNumberOfEmails: subscriberEmails.length,
      });
      subscriberEmails.forEach((subscriberEmail) => {
        cy.mhGetMailsByRecipient(subscriberEmail).as('currentRecipient');
        cy.get('@currentRecipient').should('have.length', 1);
        cy.get('@currentRecipient')
          .mhFirst()
          .then((mail) => {
            cy.checkBcc(mail).should('eq', true);
          });
      });
    });
  });

  it('prevents members and admins from other chapters from creating events', () => {
    let chapterId = 2;
    // normal member
    cy.login('test@user.org');
    cy.createEvent(chapterId, eventData).then(expectToBeRejected);

    // admin of a different chapter
    cy.login('admin@of.chapter.one');
    cy.createEvent(2, eventData).then(expectToBeRejected);

    // switch the chapterId to match the admin's chapter
    chapterId = 1;
    cy.createEvent(chapterId, {
      ...eventData,
      name: 'Created by Admin',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/events/`);
      cy.contains('Created by Admin');
      cy.contains(eventData.name).should('not.exist');
    });
  });

  function createEventViaUI(chapterId) {
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.get(`a[href="/dashboard/chapters/${chapterId}/new-event"]`).click();
    // ToDo: textbox shouldn't use component's text to indicate if it can find the component.
    cy.findByRole('textbox', { name: 'Event Title (Required)' }).type(
      testEvent.name,
    );
    cy.findByRole('textbox', { name: 'Description' }).type(
      testEvent.description,
    );
    cy.findByRole('textbox', { name: 'Event Image Url' }).type(
      testEvent.image_url,
    );
    // cy.findByRole('textbox', { name: 'Url' }).type(testEvent.url);
    cy.findByRole('spinbutton', { name: 'Capacity (Required)' }).type(
      testEvent.capacity,
    );
    cy.findByRole('textbox', { name: 'Tags (Separated by a comma)' }).type(
      'Test, Event, Tag',
    );

    cy.findByLabelText(/^Start at \(Required\)/)
      .clear()
      .type(testEvent.start_at)
      .type('{esc}');
    cy.findByLabelText(/^End at \(Required\)/)
      .clear()
      .type(testEvent.ends_at)
      .type('{esc}');

    // TODO: figure out why cypress thinks this is covered.
    // cy.findByRole('checkbox', { name: 'Invite only' }).click();
    cy.get('[data-cy="invite-only-checkbox"]').click();
    // TODO: I thought <select> would be a listbox - does it matter that it's a
    // combobox?
    cy.findByRole('combobox', { name: 'Venue' })
      .as('venueSelect')
      .select(testEvent.venue_id);
    cy.get('@venueSelect')
      .find(`option[value=${testEvent.venue_id}]`)
      .invoke('text')
      .as('venueTitle');
    cy.findByRole('textbox', { name: 'Streaming URL' }).type(
      testEvent.streaming_url,
    );

    cy.findByRole('form', { name: 'Add event' })
      .findByRole('button', {
        name: 'Add event',
      })
      .click();
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
  }
});
