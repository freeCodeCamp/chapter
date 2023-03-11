import add from 'date-fns/add';
import { EventUsers } from '../../../../cypress.config';
import {
  expectNoErrors,
  expectToBeRejected,
  getFirstPathParam,
} from '../../../support/util';

const chapterId = 1;
const eventId = 1;

function navigateToEventsDashboard() {
  cy.get('button[data-cy="menu-button"]').click();
  cy.findByRole('menuitem', { name: 'Dashboard' }).click();

  cy.get('[data-cy="dashboard-tabs"]').should('be.visible');
  cy.findByRole('link', { name: 'Events Dashboard' }).click();
  cy.contains('Loading...');
  cy.location('pathname').should('match', /^\/dashboard\/events$/);
  cy.wait('@GQLdashboardEvents');
  cy.get('[data-cy="events-dashboard"]').should('be.visible');
}

function saveEventChanges() {
  cy.findByRole('button', { name: 'Save Event Changes' }).click();
  cy.contains('Loading...');
  cy.contains('Save Event Changes').should('not.exist');
  cy.get('[data-cy="events-dashboard"]').should('be.visible');
}

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
    cy.get('a[aria-current="page"]').should('have.text', 'Events Dashboard');
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
          .should('eq', `Details changed for event ${eventTwoData['name']}`);
        cy.get('@venueMail')
          .mhGetBody()
          .should('include', 'Updated venue details')
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

  it('should be possible to change venue type, change venue and streaming url, set them to TBD', () => {
    const streamingUrl = 'https://random.com';
    cy.visit('/dashboard/events');
    cy.get('[data-cy="events-dashboard"]').should('be.visible');
    cy.findAllByRole('row')
      .filter(':has([data-cy="event"])')
      .first()
      .as('editedEvent');
    cy.get('@editedEvent').find('a').last().as('editButton');

    cy.get('@editButton').click();
    cy.contains('Loading...');

    cy.findByRole('radio', { name: 'In-person & Online' }).click({
      force: true,
    });
    cy.findByRole('combobox', { name: 'Venue' }).as('venueSelect');
    cy.get('@venueSelect').select('0');
    cy.findByRole('textbox', { name: 'Streaming URL' }).as('streamingUrlField');
    cy.get('@streamingUrlField').clear();
    saveEventChanges();

    cy.get('@editedEvent').find('[data-cy="venue"]').should('contain', 'TBD');
    cy.get('@editedEvent')
      .find('[data-cy="streamingUrl"]')
      .should('contain', 'TBD');

    cy.get('@editButton').click();
    cy.findByRole('radio', { name: 'In-person' }).click({ force: true });
    cy.get('@venueSelect').select(1);
    cy.get('@venueSelect').find('option').eq(1).invoke('text').as('venueName');
    saveEventChanges();

    cy.get('@venueName').then((venueName) => {
      cy.get('@editedEvent')
        .find('[data-cy="venue"]')
        .should('contain', venueName);
    });
    cy.get('@editedEvent')
      .find('[data-cy="streamingUrl"]')
      .should('contain', 'In-person only');

    cy.get('@editButton').click();
    cy.findByRole('radio', { name: 'Online' }).click({ force: true });
    cy.get('@streamingUrlField').type(streamingUrl);
    saveEventChanges();

    cy.get('@editedEvent')
      .find('[data-cy="venue"]')
      .should('contain', 'Online only');
    cy.get('@editedEvent')
      .find('[data-cy="streamingUrl"]')
      .should('contain', streamingUrl);
  });

  it('editing event updates cached events on home page', () => {
    cy.visit('');
    cy.contains('Upcoming events');
    cy.get('a[href*="/events/"]').first().as('eventToEdit');
    cy.get('@eventToEdit').invoke('text').as('eventTitle');
    cy.get('@eventToEdit').invoke('attr', 'href').as('eventHref');

    navigateToEventsDashboard();

    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('link', { name: 'Edit' }).click();
    const titleAddon = ' new title';

    cy.findByRole('textbox', { name: 'Event Title' }).type(titleAddon);
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
    cy.contains('Upcoming events');
    cy.get('a[href*="/events/"]').first().as('eventToDelete');
    cy.get('@eventToDelete').invoke('text').as('eventTitle');

    navigateToEventsDashboard();

    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Delete event' }).click();

    cy.get('[data-cy="events-dashboard"]').should('be.visible');
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
    cy.get('a[href="/"]').click();
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
  });

  it('emails not canceled attendees when event is canceled', () => {
    cy.visit('/dashboard/events');
    cy.findAllByRole('row')
      .not(':has([data-cy=event-canceled])')
      .find('a')
      .first()
      .click()
      .invoke('text')
      .as('eventTitle');

    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('alertdialog').findByText('Cancel event').click();

    cy.waitUntilMail().mhFirst().as('emails');

    cy.url()
      .then((url) => parseInt(url.match(/\d+$/)[0], 10))
      .then((eventId) => cy.task<EventUsers>('getEventUsers', eventId))
      .then((eventUsers) => {
        const expectedEmails = eventUsers
          .filter(({ attendance }) => attendance.name !== 'no')
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

  it('chapter admins should be allowed to edit events, members and banned users should not', () => {
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

  it('chapter admins should be allowed to delete events, members and banned users should not', () => {
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
    cy.sendEventInvite(eventId).then(expectNoErrors);

    cy.login(users.testUser.email);
    cy.sendEventInvite(eventId).then(expectToBeRejected);

    // banned admin should be rejected
    cy.login(users.bannedAdmin.email);
    cy.sendEventInvite(eventId).then(expectToBeRejected);
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
