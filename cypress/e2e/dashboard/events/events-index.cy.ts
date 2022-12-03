import add from 'date-fns/add';
import { EventUsers } from '../../../../cypress.config';
import {
  expectNoErrors,
  expectToBeRejected,
  getFirstPathParam,
} from '../../../support/util';

const chapterId = 1;
const eventId = 1;

// TODO: Move these specs into the other describe block, once we can make sure
// that Cypress is operating on an event from chapter 1.
describe('spec needing owner', () => {
  let eventTwoData;
  before(() => {
    cy.fixture('events').then((fixture) => {
      eventTwoData = fixture.eventTwo;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
    cy.mhDeleteAll();
    cy.interceptGQL('dashboardEvents');
  });

  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[href="/dashboard/events"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Events');
  });

  it('should have a table with links to view and edit events', () => {
    cy.visit('/dashboard/events');
    cy.findByRole('table', { name: 'Events' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'action' }).should('be.visible');
    cy.get('a[href="/dashboard/events/1"]').should('be.visible');
    cy.get('a[href="/dashboard/events/1/edit"]').should('be.visible');
  });

  it("emails the users when an event's venue is changed", () => {
    // It needs to be string to select by the value. When passing integer
    // to the .select method, it will select option by the index.
    const newVenueId = '2';

    cy.createEvent(chapterId, eventTwoData).then((response) => {
      const newEventId = response.body.data.createEvent.id;
      cy.visit(`/dashboard/events/${newEventId}/edit`);

      cy.findByRole('combobox', { name: 'Venue' })
        .select(newVenueId)
        .find(':checked')
        .invoke('text')
        .as('newVenueTitle');

      cy.findByRole('form', { name: 'Save Event Changes' })
        .findByRole('button', {
          name: 'Save Event Changes',
        })
        .should('be.enabled')
        .click();

      cy.location('pathname').should('match', /^\/dashboard\/events$/);

      cy.waitUntilMail().mhFirst().as('venueMail');

      cy.get('@newVenueTitle').then((venueTitle) => {
        cy.get('@venueMail')
          .mhGetSubject()
          .should('eq', `Venue changed for event ${eventTwoData['name']}`);
        cy.get('@venueMail')
          .mhGetBody()
          .should('include', 'We have had to change the location')
          .and('include', eventTwoData['name'])
          .and('include', venueTitle);

        cy.findAllByRole('row')
          .filter(`:contains(${eventTwoData['name']})`)
          .should('contain.text', venueTitle);
      });

      cy.get('@venueMail').then((mail) => {
        cy.checkBcc(mail).should('eq', true);
      });

      cy.deleteEvent(newEventId);
    });
  });

  it('editing event updates cached events on home page', () => {
    cy.visit('');
    cy.get('button[aria-controls="navigation"]').click();
    cy.findByRole('menuitem', { name: 'Events' }).click();
    cy.get('a[href*="/events/"]').first().as('eventToEdit');
    cy.get('@eventToEdit').invoke('text').as('eventTitle');
    cy.get('@eventToEdit').invoke('attr', 'href').as('eventHref');

    cy.get('button[aria-controls="navigation"]').click();
    cy.findByRole('menuitem', { name: 'Dashboard' }).click();

    cy.findByRole('link', { name: 'Events' }).click();
    cy.contains('Loading...');
    cy.wait('@GQLdashboardEvents');
    cy.get('[data-cy="events-dashboard"]').should('be.visible');

    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('link', { name: 'Edit' }).click();
    const titleAddon = ' new title';

    cy.findByRole('textbox', { name: 'Event Title (Required)' }).type(
      titleAddon,
    );
    cy.findByRole('form', { name: 'Save Event Changes' })
      .findByRole('button', {
        name: 'Save Event Changes',
      })
      .click();

    cy.get('[data-cy="events-dashboard"]').should('be.visible');
    cy.get('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: `${eventTitle}${titleAddon}` });
    });
    cy.get('a[href="/"]').click();
    cy.get('@eventHref').then((eventHref) => {
      cy.get(`a[href="${eventHref}"]`)
        .invoke('text')
        .should('contain', titleAddon);
    });
  });

  it('deleting event updates cached events on home page', () => {
    cy.visit('');
    cy.get('a[href*="/events/"]').first().as('eventToDelete');
    cy.get('@eventToDelete').invoke('text').as('eventTitle');

    cy.get('button[aria-controls="navigation"]').click();
    cy.findByRole('menuitem', { name: 'Dashboard' }).click();
    cy.findByRole('link', { name: 'Events' }).click();
    cy.contains('Loading...');
    cy.wait('@GQLdashboardEvents');
    cy.get('[data-cy="events-dashboard"]').should('be.visible');
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Delete' }).click();

    cy.get('[data-cy="events-dashboard"]').should('be.visible');
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
    cy.get('a[href="/"]').click();
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
  });

  it('emails not canceled rsvps when event is canceled', () => {
    cy.visit('/dashboard/events');
    cy.findAllByRole('row')
      .not(':has([data-cy=event-canceled])')
      .find('a')
      .first()
      .click()
      .invoke('text')
      .as('eventTitle');

    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('alertdialog').findByText('Confirm').click();

    cy.waitUntilMail().mhFirst().as('emails');

    cy.url()
      .then((url) => parseInt(url.match(/\d+$/)[0], 10))
      .then((eventId) => cy.task<EventUsers>('getEventUsers', eventId))
      .then((eventUsers) => {
        const expectedEmails = eventUsers
          .filter(({ rsvp }) => rsvp.name !== 'no')
          .map(({ user: { email } }) => email);
        cy.get('@emails')
          .mhGetRecipients()
          .should('have.members', expectedEmails);
      });

    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.get('@emails').mhGetSubject().should('include', eventTitle);
    });

    cy.get('@emails').then((emails) => {
      cy.checkBcc(emails).should('eq', true);
    });

    cy.mhDeleteAll();
  });
});

describe('events dashboard', () => {
  let event;
  let users;
  before(() => {
    cy.fixture('events').then((fixture) => {
      event = fixture.eventWithoutDate;
    });
    cy.fixture('users').then((fixture) => {
      users = fixture;
    });
  });
  beforeEach(() => {
    cy.task('seedDb');
    cy.login(users.chapter1Admin.email);
    cy.mhDeleteAll();
    cy.interceptGQL('dashboardEvents');
  });

  it('chapter admin should be allowed to edit event, but nobody else', () => {
    const eventOneData = {
      ...event,
      start_at: new Date(),
      ends_at: add(new Date(), { minutes: 30 }),
    };

    cy.updateEvent(eventId, eventOneData).then(expectNoErrors);
    // newly registered user (without a chapter_users record)
    cy.login(users.testUser.email);
    cy.updateEvent(eventId, eventOneData).then(expectToBeRejected);

    // banned admin should be rejected
    cy.login(users.bannedAdmin.email);
    cy.updateEvent(eventId, eventOneData).then(expectToBeRejected);
  });

  it('chapter admin should be allowed to delete event, but nobody else', () => {
    // newly registered user (without a chapter_users record)
    cy.login(users.testUser.email);
    cy.deleteEvent(eventId).then(expectToBeRejected);
    // banned admin should be rejected
    cy.login(users.bannedAdmin.email);
    cy.deleteEvent(eventId).then(expectToBeRejected);

    // admin of chapter 1
    cy.login(users.chapter1Admin.email);
    cy.deleteEvent(eventId).then(expectNoErrors);
  });

  it('chapter admin should be allowed to send email to attendees', () => {
    const eventId = 1;
    cy.sendEventInvite(eventId, ['confirmed']).then(expectNoErrors);

    cy.login(users.testUser.email);
    cy.sendEventInvite(eventId, ['confirmed']).then(expectToBeRejected);

    // banned admin should be rejected
    cy.login(users.bannedAdmin.email);
    cy.sendEventInvite(eventId, ['confirmed']).then(expectToBeRejected);
  });

  it('chapter admin should see only events from admined chapters', () => {
    cy.login(users.chapter1Admin.email);
    const chapterId = 1;
    cy.visit('/dashboard/events');
    cy.getChapterEvents(chapterId).then((events) => {
      const eventIds = events.map(({ id }) => id);
      cy.get('[data-cy=event]').each((link) =>
        expect(eventIds).to.include(getFirstPathParam(link)),
      );
    });
  });
});
