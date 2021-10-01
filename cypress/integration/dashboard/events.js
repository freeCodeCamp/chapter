const testEvent = {
  title: 'Test Event',
  description: 'Test Description',
  url: 'https://test.event.org',
  videoUrl: 'https://test.event.org/video',
  capacity: '10',
  tags: 'Test, Event, Tag',
  startAt: '2022-01-01T00:01',
  endAt: '2022-01-02T00:02',
  venueId: '1',
};

describe('events dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:reset');
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
    cy.get('a[href="/dashboard/events/new"]').should('be.visible');
    cy.get('a[href="/dashboard/events/1/edit"]').should('be.visible');
  });

  it('lets a user create an event', () => {
    createEvent();
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d/);
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
  });

  function createEvent() {
    cy.visit('/dashboard/events');
    cy.get('a[href="/dashboard/events/new"]').click();
    cy.findByRole('textbox', { name: 'Event title' }).type(testEvent.title);
    cy.findByRole('textbox', { name: 'Description' }).type(
      testEvent.description,
    );
    cy.findByRole('textbox', { name: 'Url' }).type(testEvent.url);
    cy.findByRole('textbox', { name: 'Video Url' }).type(testEvent.videoUrl);
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

    cy.findByRole('form', { name: 'Add event' }).submit();
  }

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
      .get(':checked')
      .invoke('val')
      .as('currentVenueId');
    cy.get('@currentVenueId').then((id) => {
      // Small venue ids will definitely be present, so we select '1', unless
      // it's currently selected, in which case we select '2'.
      id = id == '1' ? '2' : '1';
      cy.get('@venueSelect')
        .select(id)
        .get(':checked')
        .invoke('text')
        .as('newVenueTitle');
    });
    cy.findByRole('form', { name: 'Save Event Changes' }).submit();

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
});
