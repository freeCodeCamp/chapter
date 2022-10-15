import add from 'date-fns/add';
import { VenueType } from '../../../../client/src/generated/graphql';
import { EventUsers } from '../../../../cypress.config';
import { expectToBeRejected } from '../../../support/util';

const eventOneData = {
  name: 'Homer Simpson',
  description: 'i will show you damn!',
  streaming_url: null,
  capacity: 149,
  start_at: new Date(),
  ends_at: add(new Date(), { minutes: 30 }),
  venue_type: 'Physical',
  venue_id: 2,
  image_url: 'http://loremflickr.com/640/480/nature?79359',
  invite_only: false,
  sponsor_ids: [],
};

const eventTwoData = {
  venue_id: 1,
  sponsor_ids: [],
  name: 'Event Venue change test',
  description: 'Test Description',
  venue_type: VenueType.PhysicalAndOnline,
  capacity: 10,
  image_url: 'https://test.event.org/image',
  streaming_url: 'https://test.event.org/video',
  start_at: '2022-01-01T00:01',
  ends_at: '2022-01-02T00:02',
};

// TODO: Move these specs into the other describe block, once we can make sure
// that Cypress is operating on an event from chapter 1.
describe('spec needing owner', () => {
  beforeEach(() => {
    cy.task('seedDb');
    cy.login();
    cy.mhDeleteAll();
    cy.interceptGQL('events');
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

  function sendAndCheckEmails(filterCallback, users) {
    cy.mhDeleteAll();
    cy.findByRole('button', { name: 'Send Email' }).click();
    cy.contains('Email sent');

    const recipientEmails = users
      .filter(filterCallback)
      .map(({ user: { email } }) => email);
    cy.waitUntilMail({ expectedNumberOfEmails: recipientEmails.length });
    recipientEmails.forEach((recipientEmail) => {
      cy.mhGetMailsByRecipient(recipientEmail).as('currentRecipient');
      cy.get('@currentRecipient').should('have.length', 1);
      cy.get('@currentRecipient')
        .mhFirst()
        .then((mail) => {
          cy.checkBcc(mail).should('eq', true);
        });
    });
  }

  it('has a button to email attendees', () => {
    cy.visit('/dashboard/events/1');
    // sending to confirmed first
    cy.findByRole('button', { name: 'Email Attendees' }).click();
    cy.findByLabelText('Confirmed').should('be.checked');
    cy.findByLabelText('Waitlist').should('not.be.checked');
    cy.findByLabelText('Canceled').should('not.be.checked');
    cy.task<EventUsers>('getEventUsers', 1).then((results) => {
      const eventUsers = results.filter(({ subscribed }) => subscribed);
      const isRsvpConfirmed = ({ rsvp }) => rsvp.name === 'yes';
      sendAndCheckEmails(isRsvpConfirmed, eventUsers);

      // sending to waitlist
      cy.findByRole('button', { name: 'Email Attendees' }).click();
      cy.findByLabelText('Confirmed').parent().click();
      cy.findByLabelText('Waitlist').parent().click();
      const isRsvpOnWaitlist = ({ rsvp }) => rsvp.name === 'waitlist';
      sendAndCheckEmails(isRsvpOnWaitlist, eventUsers);

      // sending to canceled
      cy.findByRole('button', { name: 'Email Attendees' }).click();
      cy.findByLabelText('Waitlist').parent().click();
      cy.findByLabelText('Canceled').parent().click();
      const isRSVPCanceled = ({ rsvp }) => rsvp.name === 'no';
      sendAndCheckEmails(isRSVPCanceled, eventUsers);

      // sending to all
      cy.findByRole('button', { name: 'Email Attendees' }).click();
      cy.findByLabelText('Waitlist').parent().click();
      cy.findByLabelText('Confirmed').parent().click();
      sendAndCheckEmails(() => true, eventUsers);
    });
  });

  it('invitation email should include calendar file', () => {
    cy.visit('/dashboard/events/1');

    cy.findByRole('button', { name: 'Email Attendees' }).click();

    // try to make sure there will be recipient
    cy.findByLabelText('Waitlist').parent().click();
    cy.findByLabelText('Canceled').parent().click();

    cy.findByRole('button', { name: 'Send Email' }).click();

    const calendarMIME = 'application/ics; name=calendar.ics';
    const bodyRegex = new RegExp(
      /BEGIN:VCALENDAR.*BEGIN:VEVENT.*END:VEVENT.*END:VCALENDAR/,
      's',
    );

    cy.waitUntilMail()
      .mhFirst()
      .then((mail) => {
        const MIME = mail.MIME as {
          Parts: { Headers: unknown; Body: unknown }[];
        };
        const hasCalendar = MIME.Parts.some((part) => {
          const contentType = part.Headers['Content-Type'];
          if (contentType?.includes(calendarMIME)) {
            // @ts-expect-error cypress-mailhog is missing types for this
            const body = Buffer.from(part.Body, 'base64').toString();
            return bodyRegex.test(body);
          }
        });
        expect(hasCalendar).to.be.true;
      });
  });

  it("emails the users when an event's venue is changed", () => {
    // It needs to be string to select by the value. When passing integer
    // to the .select method, it will select option by the index.
    const newVenueId = '2';

    cy.createEvent(1, eventTwoData).then((response) => {
      const eventId = response.body.data.createEvent.id;
      cy.visit(`/dashboard/events/${eventId}/edit`);

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

      cy.deleteEvent(eventId);
    });
  });

  it('editing event updates cached events on home page', () => {
    cy.visit('');
    cy.get('button[aria-label="Options"]').click();
    cy.findByRole('menuitem', { name: 'Events' }).click();
    cy.get('a[href*="/events/"]').first().as('eventToEdit');
    cy.get('@eventToEdit').invoke('text').as('eventTitle');
    cy.get('@eventToEdit').invoke('attr', 'href').as('eventHref');

    cy.get('button[aria-label="Options"]').click();
    cy.findByRole('menuitem', { name: 'Dashboard' }).click();

    cy.findByRole('link', { name: 'Events' }).click();
    cy.contains('Loading...');
    cy.wait('@GQLevents');
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

    cy.get('button[aria-label="Options"]').click();
    cy.findByRole('menuitem', { name: 'Dashboard' }).click();
    cy.findByRole('link', { name: 'Events' }).click();
    cy.contains('Loading...');
    cy.wait('@GQLevents');
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
  beforeEach(() => {
    cy.task('seedDb');
    cy.login('admin@of.chapter.one');
    cy.mhDeleteAll();
    cy.interceptGQL('events');
  });

  it('chapter admin should be allowed to edit event, but nobody else', () => {
    const eventId = 1;

    cy.updateEvent(eventId, eventOneData).then((response) => {
      expect(response.body.errors).not.to.exist;
    });
    // newly registered user (without a chapter_users record)
    cy.login('test@user.org');
    cy.updateEvent(eventId, eventOneData).then(expectToBeRejected);

    // banned admin should be rejected
    cy.login('banned@chapter.admin');
    cy.updateEvent(eventId, eventOneData).then(expectToBeRejected);
  });

  it('chapter admin should be allowed to delete event, but nobody else', () => {
    const eventId = 1;

    // newly registered user (without a chapter_users record)
    cy.login('test@user.org');
    cy.deleteEvent(eventId).then(expectToBeRejected);
    // banned admin should be rejected
    cy.login('banned@chapter.admin');
    cy.deleteEvent(eventId).then(expectToBeRejected);

    // admin of chapter 1
    cy.login('admin@of.chapter.one');
    cy.deleteEvent(eventId).then((response) => {
      expect(response.body.errors).not.to.exist;
    });
  });

  it('chapter admin should be allowed to send email to attendees', () => {
    const eventId = 1;
    cy.sendEventInvite(eventId, ['confirmed']).then((response) => {
      expect(response.body.errors).not.to.exist;
    });

    cy.login('test@user.org');
    cy.sendEventInvite(eventId, ['confirmed']).then(expectToBeRejected);

    // banned admin should be rejected
    cy.login('banned@chapter.admin');
    cy.sendEventInvite(eventId, ['confirmed']).then(expectToBeRejected);
  });
});
