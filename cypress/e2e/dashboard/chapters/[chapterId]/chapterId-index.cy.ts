import { expectNoErrors, expectToBeRejected } from '../../../../support/util';
import type { ChapterMembers } from '../../../../../cypress.config';

const chapterId = 1;

function createEventViaUI({ chapterId, eventData, createInPast = false }) {
  cy.visit(`/dashboard/chapters/${chapterId}`);
  cy.get(`a[href="/dashboard/chapters/${chapterId}/new-event"]`).click();
  cy.findByRole('textbox', { name: 'Event Title' }).type(eventData.name);
  cy.findByRole('textbox', { name: 'Description' }).type(eventData.description);
  cy.findByRole('textbox', { name: 'Tags (separated by a comma)' }).type(
    eventData.event_tags,
  );
  cy.findByRole('textbox', { name: 'Event Image Url' }).type(
    eventData.image_url,
  );
  // cy.findByRole('textbox', { name: 'Url' }).type(testEvent.url);
  cy.findByRole('spinbutton', { name: 'Capacity' }).type(eventData.capacity);

  const whichMonth = createInPast ? 'Previous' : 'Next';
  cy.findByLabelText(/^Start at/).click();
  cy.get(`[aria-label="${whichMonth} Month"]`).click().click();
  cy.findByRole('option', { name: /.*15th, .*/ }).click();
  cy.findByText('12:00 PM').click();

  cy.findByLabelText(/^End at/).click();
  cy.get(`[aria-label="${whichMonth} Month"]`).click().click();
  cy.findByRole('option', { name: /.*17th, .*/ }).click();
  cy.findByText('12:30 PM').click();

  cy.get('[data-cy="past-date-info"]').should(
    createInPast ? 'be.visible' : 'not.exist',
  );

  // TODO: figure out why cypress thinks this is covered.
  // cy.findByRole('checkbox', { name: 'Invite only' }).click();
  cy.get('[data-cy="invite-only-checkbox"]').click();
  // TODO: I thought <select> would be a listbox - does it matter that it's a
  // combobox?
  cy.findByRole('combobox', { name: 'Venue' })
    .as('venueSelect')
    .select(eventData.venue_id);
  cy.get('@venueSelect')
    .find(`option[value=${eventData.venue_id}]`)
    .invoke('text')
    .as('venueTitle');
  cy.findByRole('textbox', { name: 'Streaming URL' }).type(
    eventData.streaming_url,
  );
  cy.findByRole('button', { name: 'Add Sponsor' }).click();

  cy.findByRole('checkbox', { name: 'Attend Event' }).should('be.checked');

  cy.findByRole('form', { name: 'Add event' })
    .findByRole('button', {
      name: 'Add event',
    })
    .click();
  cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
}

describe('chapter dashboard', () => {
  let users;
  let events;
  before(() => {
    cy.fixture('events').then((fixture) => {
      events = fixture;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login(users.chapter1Admin.email);
    cy.mhDeleteAll();
  });

  it('should have link to add event for chapter', () => {
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.get(`a[href="/dashboard/chapters/${chapterId}/new-event"`).should(
      'be.visible',
    );
  });

  it('emails interested users when an event is created', () => {
    // confirm url is not required
    const testEvent = { ...events.eventWithoutDateAndURL };

    createEventViaUI({ chapterId, eventData: testEvent });
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
    // confirm that the test data appears in the new event
    Object.entries(testEvent).forEach(([key, value]) => {
      // TODO: simplify this conditional when tags and dates are handled
      // properly.
      if (key === 'event_tags') {
        cy.get('[data-cy=tags-box]').as('tagsBox');
        (value as string).split(',').forEach((tag) => {
          cy.get('@tagsBox').contains(tag.trim());
        });
      } else if (!['start_at', 'ends_at', 'venue_id'].includes(key)) {
        cy.contains(value as string);
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
    cy.task<ChapterMembers>('getChapterMembers', chapterId).then((members) => {
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

  it('event created with past date should not send out email invites', () => {
    const testEvent = { ...events.eventWithoutDateAndURL };

    createEventViaUI({ chapterId, eventData: testEvent, createInPast: true });
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);

    cy.mhGetAllMails().should('have.length', 0);
  });

  it('prevents members and admins from other chapters from creating events', () => {
    const otherChapterId = 2;
    const eventData = {
      ...events.eventWithoutDateAndURL,
      ...events.partialData,
    };
    // normal member
    cy.login(users.testUser.email);
    cy.createEvent(otherChapterId, eventData).then(expectToBeRejected);

    // admin of a different chapter
    cy.login(users.chapter1Admin.email);
    cy.createEvent(otherChapterId, eventData).then(expectToBeRejected);

    // switch the chapterId to match the admin's chapter
    cy.createEvent(chapterId, {
      ...eventData,
      name: 'Created by Admin',
    }).then((response) => {
      expectNoErrors(response);
      cy.visit(`/dashboard/events/`);
      cy.contains('Created by Admin');
      cy.contains(eventData.name).should('not.exist');
    });
  });
});
