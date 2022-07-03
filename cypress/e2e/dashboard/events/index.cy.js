import { aliasQuery } from '../../utils/graphql-test-utils';

const testEvent = {
  title: 'Test Event',
  description: 'Test Description',
  url: 'https://test.event.org',
  streamingUrl: 'https://test.event.org/video',
  capacity: '10',
  tags: 'Test, Event, Tag',
  startAt: '2022-01-01T00:01',
  endAt: '2022-01-02T00:02',
  venueId: '1',
  imageUrl: 'https://test.event.org/image',
};

describe('events dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
    cy.mhDeleteAll();
    cy.intercept('POST', 'http://localhost:5000/graphql', (req) => {
      // Queries
      aliasQuery(req, 'events');
    });
  });

  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    //cy.get('a[aria-current="page"]').should('have.text', 'Dashboard');
    cy.get('a[href="/dashboard/events"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Events');
  });

  it('should have a table with links to view, create and edit events', () => {
    cy.visit('/dashboard/events');
    cy.findByRole('table', { name: 'Events' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'name' }).should('be.visible');
    cy.findByRole('columnheader', { name: 'actions' }).should('be.visible');
    cy.get('a[href="/dashboard/events/1"]').should('be.visible');
    cy.get('a[href="/dashboard/events/1/edit"]').should('be.visible');
  });

  it('emails interested users when an event is created', () => {
    createEvent(1);
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
    // confirm that the test data appears in the new event
    cy.wrap(Object.entries(testEvent)).each(([key, value]) => {
      // TODO: simplify this conditional when tags and dates are handled
      // properly.
      if (!['tags', 'startAt', 'endAt', 'venueId'].includes(key)) {
        cy.contains(value);
      }
    });
    // check that the title we selected is in the event we created.
    cy.get('@venueTitle').then((venueTitle) => {
      cy.contains(venueTitle);
    });

    // check that the subscribed users have been emailed
    cy.waitUntilMail('allMail');

    cy.get('@allMail').mhFirst().as('invitation');
    // TODO: select chapter during event creation and use that here (much like @venueTitle
    // ) i.e. remove the hardcoding.
    cy.getChapterMembers(1).then((members) => {
      const subscriberEmails = members
        .filter(({ subscribed }) => subscribed)
        .map(({ user: { email } }) => email);
      cy.get('@invitation')
        .mhGetRecipients()
        .should('have.members', subscriberEmails);
    });
    cy.get('@invitation').then((mail) => {
      cy.checkBcc(mail).should('eq', true);
    });
  });

  function createEvent(chapterId) {
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.get(`a[href="/dashboard/chapters/${chapterId}/new_event"]`).click();
    cy.findByRole('textbox', { name: 'Event title' }).type(testEvent.title);
    cy.findByRole('textbox', { name: 'Description' }).type(
      testEvent.description,
    );
    cy.findByRole('textbox', { name: 'Event Image Url' }).type(
      testEvent.imageUrl,
    );
    cy.findByRole('textbox', { name: 'Url' }).type(testEvent.url);
    cy.findByRole('spinbutton', { name: 'Capacity' }).type(testEvent.capacity);
    cy.findByRole('textbox', { name: 'Tags (separated by a comma)' }).type(
      'Test, Event, Tag',
    );

    cy.findByLabelText(/^Start at/)
      .clear()
      .type(testEvent.startAt)
      .type('{esc}');
    cy.findByLabelText(/^End at/)
      .clear()
      .type(testEvent.endAt)
      .type('{esc}');

    // TODO: figure out why cypress thinks this is covered.
    // cy.findByRole('checkbox', { name: 'Invite only' }).click();
    cy.get('[data-cy="invite-only-checkbox"]').click();
    // TODO: I thought <select> would be a listbox - does it matter that it's a
    // combobox?
    cy.findByRole('combobox', { name: 'Venue' })
      .as('venueSelect')
      .select(testEvent.venueId);
    cy.get('@venueSelect')
      .find(`option[value=${testEvent.venueId}]`)
      .invoke('text')
      .as('venueTitle');
    cy.findByRole('textbox', { name: 'Streaming URL' }).type(
      testEvent.streamingUrl,
    );

    cy.findByRole('form', { name: 'Add event' })
      .findByRole('button', {
        name: 'Add event',
      })
      .click();
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
  }

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
    cy.findByRole('button', { name: 'Send Email' }).click();

    cy.waitUntilMail('allMail');
    cy.get('@allMail').mhFirst().as('emails');

    const emails = users
      .filter(filterCallback)
      .map(({ user: { email } }) => email);
    cy.get('@emails').mhGetRecipients().should('have.members', emails);
    cy.get('@emails').then((mail) => {
      cy.checkBcc(mail).should('eq', true);
    });
    cy.mhDeleteAll();
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
        const hasCalendar = mail.MIME.Parts.some((part) => {
          const contentType = part.Headers['Content-Type'];
          if (contentType?.includes(calendarMIME)) {
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
      chapter_id: 1,
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

    cy.createEvent(eventData).then((eventId) => {
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
    cy.wait('@gqleventsQuery');
    cy.url().should('include', '/events');
    cy.get('#page-heading').contains('Events');
    cy.contains('Loading...').should('not.exist');

    cy.get('@eventTitle').then((eventTitle) => {
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
    cy.wait('@gqleventsQuery');
    cy.get('#page-heading').contains('Events');
    cy.contains('Loading...').should('not.exist');
    cy.get('@eventTitle').then((eventTitle) => {
      cy.findByRole('link', { name: eventTitle }).click();
    });

    cy.findByRole('button', { name: 'Delete' }).click();
    cy.findByRole('button', { name: 'Delete' }).click();

    cy.get('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
    cy.get('a[href="/"]').click();
    cy.get('@eventTitle').then((eventTitle) => {
      cy.contains(eventTitle).should('not.exist');
    });
  });

  it('emails not canceled rsvps when event is canceled', () => {
    cy.visit('/dashboard/events');
    cy.findAllByRole('row')
      .not(':contains("canceled")')
      .find('a')
      .first('contains(/dashboard/events/\\d+$)')
      .click()
      .invoke('text')
      .as('eventTitle');

    cy.findByRole('button', { name: 'Cancel' }).click();
    cy.findByRole('alertdialog').findByText('Confirm').click();

    cy.waitUntilMail('allMail');
    cy.get('@allMail').mhFirst().as('emails');

    cy.url()
      .then((url) => parseInt(url.match(/\d+$/)))
      .as('eventId');
    cy.get('@eventId')
      .then((eventId) => cy.getEventUsers(eventId))
      .then((eventUsers) => {
        const expectedEmails = eventUsers
          .filter(({ rsvp }) => rsvp.name !== 'no')
          .map(({ user: { email } }) => email);
        cy.get('@emails')
          .mhGetRecipients()
          .should('have.members', expectedEmails);
      });

    cy.get('@eventTitle').then((eventTitle) => {
      cy.get('@emails').mhGetSubject().should('include', eventTitle);
    });

    cy.get('@emails').then((emails) => {
      cy.checkBcc(emails).should('eq', true);
    });

    cy.mhDeleteAll();
  });
});
