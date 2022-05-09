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
  });
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('have.text', 'Dashboard');
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

    cy.findByLabelText(/^Start at/).type(testEvent.startAt);

    cy.findByLabelText(/^End at/).type(testEvent.endAt);
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
    cy.findByLabelText('Cancelled').should('not.be.checked');
    const isRsvpConfirmed = (r) =>
      r.on_waitlist === false && r.canceled === false;
    sendAndCheckEmails(isRsvpConfirmed);

    // sending to waitlist
    cy.findByRole('button', { name: 'Email Attendees' }).click();
    cy.findByLabelText('Confirmed').parent().click();
    cy.findByLabelText('Waitlist').parent().click();
    const isRsvpOnWaitlist = (r) => r.on_waitlist === true;
    sendAndCheckEmails(isRsvpOnWaitlist);

    // sending to cancelled
    cy.findByRole('button', { name: 'Email Attendees' }).click();
    cy.findByLabelText('Waitlist').parent().click();
    cy.findByLabelText('Cancelled').parent().click();
    const isRSVPCancelled = (r) => r.canceled === true;
    sendAndCheckEmails(isRSVPCancelled);

    // sending to all
    cy.findByRole('button', { name: 'Email Attendees' }).click();
    cy.findByLabelText('Waitlist').parent().click();
    cy.findByLabelText('Confirmed').parent().click();
    sendAndCheckEmails(() => true);
  });

  function sendAndCheckEmails(filterCallback) {
    cy.findByRole('button', { name: 'Send Email' }).click();

    cy.waitUntilMail('allMail');
    cy.get('@allMail').mhFirst().as('emails');

    // TODO: can we avoid getting this multiple times?
    cy.getRSVPs(1).then((rsvps) => {
      const expectedEmails = rsvps
        .filter(filterCallback)
        .map(({ user: { email } }) => email);
      cy.get('@emails')
        .mhGetRecipients()
        .should('have.members', expectedEmails);
    });
    cy.mhDeleteAll();
  }

  it('invitation email should include calendar file', () => {
    cy.visit('/dashboard/events/1');

    cy.findByRole('button', { name: 'Email Attendees' }).click();

    // try to make sure there will be recipient
    cy.findByLabelText('Waitlist').parent().click();
    cy.findByLabelText('Cancelled').parent().click();

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
    cy.visit('/dashboard/events');
    cy.findAllByRole('link', { name: 'Edit' }).first().click();

    cy.findByRole('textbox', { name: 'Event title' })
      .invoke('val')
      .as('eventTitle');

    // This is a bit convoluted, but we need to know the current venue in order
    // to change it.
    cy.findByRole('combobox', { name: 'Venue' })
      .as('venueSelect')
      .find(':checked')
      .invoke('val')
      .as('currentVenueId');
    cy.get('@currentVenueId').then((id) => {
      // Small venue ids will definitely be present, so we select '1', unless
      // it's currently selected, in which case we select '2'.
      id = id == '1' ? '2' : '1';
      cy.get('@venueSelect')
        .select(id)
        .find(':checked')
        .invoke('text')
        .as('newVenueTitle');
    });
    cy.findByRole('form', { name: 'Save Event Changes' })
      .findByRole('button', {
        name: 'Save Event Changes',
      })
      .click();

    cy.location('pathname').should('match', /^\/dashboard\/events$/);

    cy.waitUntilMail('allMail');

    cy.get('@allMail').mhFirst().as('venueMail');

    cy.get('@newVenueTitle').then((venueTitle) => {
      cy.get('@eventTitle').then((eventTitle) => {
        cy.get('@venueMail')
          .mhGetSubject()
          .should('eq', `Venue changed for event ${eventTitle}`);
        cy.get('@venueMail')
          .mhGetBody()
          .should('include', 'We have had to change the location')
          .and('include', eventTitle)
          .and('include', venueTitle);
      });

      // TODO: this is a bit brittle, since we're looking for a specific row
      // within the datatable. Also, is this table an accessible way to present
      // the events?
      cy.findAllByRole('row').then((rows) => {
        cy.wrap(rows[1]).should('contain.text', venueTitle);
      });
    });
  });

  it('editing event updates cached events on home page', () => {
    cy.visit('');
    cy.get('a[href*="/events/"').first().as('eventToEdit');
    cy.get('@eventToEdit').invoke('text').as('eventTitle');
    cy.get('@eventToEdit').invoke('attr', 'href').as('eventHref');

    cy.findByRole('link', { name: 'Dashboard' }).click();
    cy.findByRole('link', { name: 'Events' }).click();
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

  it('emails not cancelled rsvps when event is cancelled', () => {
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
      .then((eventId) => cy.getRSVPs(eventId))
      .then((rsvps) => {
        const expectedEmails = rsvps
          .filter((rsvp) => !rsvp.canceled)
          .map(({ user: { email } }) => email);
        cy.get('@emails')
          .mhGetRecipients()
          .should('have.members', expectedEmails);
      });

    cy.get('@eventTitle').then((eventTitle) => {
      cy.get('@emails').mhGetSubject().should('include', eventTitle);
    });
    cy.mhDeleteAll();
  });
});
