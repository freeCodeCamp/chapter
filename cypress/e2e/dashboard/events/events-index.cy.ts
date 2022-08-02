import { expectToBeRejected } from '../../../support/util';

const eventData = {
  name: 'Homer Simpson3',
  description: 'i will show you damn!',
  url: 'http://wooden-swing.com',
  streaming_url: null,
  capacity: 149,
  start_at: '2022-08-03T18:45:00.000Z',
  ends_at: '2022-08-03T18:45:00.000Z',
  venue_type: 'Physical',
  venue_id: 2,
  image_url: 'http://loremflickr.com/640/480/nature?79359',
  invite_only: false,
  tags: ['aut'],
  sponsor_ids: [],
  chapter_id: 1,
};
describe('events dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
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
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
    cy.get('a[href="/dashboard/events/1"]').should('be.visible');
    cy.get('a[href="/dashboard/events/1/edit"]').should('be.visible');
  });

  it('has a button to email attendees', () => {
    cy.visit('/dashboard/events/1');
    // sending to confirmed first
    cy.findByRole('button', { name: 'Email Attendees' }).click();
    cy.findByLabelText('Confirmed').should('be.checked');
    cy.findByLabelText('Waitlist').should('not.be.checked');
    cy.findByLabelText('Canceled').should('not.be.checked');
    cy.getEventUsers(1).then((results) => {
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

  function sendAndCheckEmails(filterCallback, users) {
    cy.mhDeleteAll();
    cy.findByRole('button', { name: 'Send Email' }).click();

    cy.waitUntilMail('allMail');

    const recipientEmails = users
      .filter(filterCallback)
      .map(({ user: { email } }) => email);
    cy.get('@allMail').should('have.length', recipientEmails.length);
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

    cy.waitUntilMail('email');
    cy.get('@email')
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
    const eventData = {
      venue_id: 1,
      sponsor_ids: [],
      name: 'Event Venue change test',
      description: 'Test Description',
      url: 'https://test.event.org',
      venue_type: 'PhysicalAndOnline',
      capacity: 10,
      image_url: 'https://test.event.org/image',
      streaming_url: 'https://test.event.org/video',
      start_at: '2022-01-01T00:01',
      ends_at: '2022-01-02T00:02',
      tags: 'Test, Event, Tag',
    };
    const newVenueId = 2;

    cy.createEvent(1, eventData).then((response) => {
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
        .click();

      cy.location('pathname').should('match', /^\/dashboard\/events$/);

      cy.waitUntilMail('allMail');

      cy.get('@allMail').mhFirst().as('venueMail');

      cy.get('@newVenueTitle').then((venueTitle) => {
        cy.get('@venueMail')
          .mhGetSubject()
          .should('eq', `Venue changed for event ${eventData['name']}`);
        cy.get('@venueMail')
          .mhGetBody()
          .should('include', 'We have had to change the location')
          .and('include', eventData['name'])
          .and('include', venueTitle);

        cy.findAllByRole('row')
          .filter(`:contains(${eventData['name']})`)
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
    cy.get('a[href*="/events/"').first().as('eventToEdit');
    cy.get('@eventToEdit').invoke('text').as('eventTitle');
    cy.get('@eventToEdit').invoke('attr', 'href').as('eventHref');

    cy.findByRole('link', { name: 'Dashboard' }).click();

    cy.findByRole('link', { name: 'Events' }).click();
    cy.wait('@GQLevents');
    cy.url().should('include', '/events');
    cy.get('#page-heading').contains('Events');
    cy.contains('Loading...').should('not.exist');

    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('link', { name: 'Edit' }).click();
    const titleAddon = ' new title';

    cy.findByRole('textbox', { name: 'Event title' }).type(titleAddon);
    cy.findByRole('form', { name: 'Save Event Changes' })
      .findByRole('button', {
        name: 'Save Event Changes',
      })
      .click();

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
    cy.get('a[href*="/events/"').first().as('eventToDelete');
    cy.get('@eventToDelete').invoke('text').as('eventTitle');

    cy.findByRole('link', { name: 'Dashboard' }).click();
    cy.findByRole('link', { name: 'Events' }).click();
    cy.wait('@GQLevents');
    cy.get('#page-heading').contains('Events');
    cy.contains('Loading...').should('not.exist');
    cy.get<string>('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Delete' }).click();

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
      .not(':contains("canceled")')
      .find('a')
      .first()
      .click()
      .invoke('text')
      .as('eventTitle');

    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('alertdialog').findByText('Confirm').click();

    cy.waitUntilMail('allMail');
    cy.get('@allMail').mhFirst().as('emails');

    cy.url()
      .then((url) => parseInt(url.match(/\d+$/)[0], 10))
      .then((eventId) => cy.getEventUsers(eventId))
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

  it('chapter admin should be allowed to edit event, but nobody else', () => {
    const eventId = 1;
    // admin of chapter 1
    cy.login(Cypress.env('JWT_CHAPTER_1_ADMIN_USER'));
    cy.reload();
    cy.updateEvent(eventId, eventData).then((response) => {
      expect(response.body.errors).not.to.exist;
    });
    cy.logout();
    // newly registered user (without a chapter_users record)
    cy.register();

    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.reload();
    cy.updateEvent(eventId, eventData).then(expectToBeRejected);
    cy.logout();
    // banned admin should be rejected
    cy.login(Cypress.env('JWT_BANNED_ADMIN_USER'));
    cy.reload();
    cy.updateEvent(eventId, eventData).then(expectToBeRejected);
  });

  it('chapter admin should be allowed to delete event, but nobody else', () => {
    const eventId = 1;
    // admin of chapter 1
    cy.login(Cypress.env('JWT_ADMIN_USER'));
    cy.reload();
    cy.deleteEvent(eventId).then((response) => {
      expect(response.body.errors).not.to.exist;
    });
    cy.logout();
    // newly registered user (without a chapter_users record)
    cy.register();

    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.reload();
    cy.deleteEvent(eventId).then(expectToBeRejected);
    cy.logout();
    // banned admin should be rejected
    cy.login(Cypress.env('JWT_BANNED_ADMIN_USER'));
    cy.reload();
    cy.deleteEvent(eventId).then(expectToBeRejected);
  });
});
