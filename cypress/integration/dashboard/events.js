describe('events dashboard', () => {
  beforeEach(() => {
    cy.login();
  });
  it('should be the active dashboard link', () => {
    cy.visit('/dashboard/');
    cy.get('a[aria-current="page"]').should('have.text', 'Dashboard');
    cy.get('a[href="/dashboard/events"]').click();
    cy.get('a[aria-current="page"]').should('have.text', 'Events');
  });

  it('should have links to view, create and edit events', () => {
    cy.visit('/dashboard/events');
    cy.get('a[href="/dashboard/events/1"]').should('be.visible');
    cy.get('a[href="/dashboard/events/new"]').should('be.visible');
    cy.get('a[href="/dashboard/events/1/edit"]').should('be.visible');
  });

  it('lets a user create an event', () => {
    const fix = {
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
    cy.visit('/dashboard/events');
    cy.get('a[href="/dashboard/events/new"]').click();
    cy.findByRole('textbox', { name: 'Event title' }).type(fix.title);
    cy.findByRole('textbox', { name: 'Description' }).type(fix.description);
    cy.findByRole('textbox', { name: 'Url' }).type(fix.url);
    cy.findByRole('textbox', { name: 'Video Url' }).type(fix.videoUrl);
    cy.findByRole('textbox', { name: 'Capacity' }).type(fix.capacity);
    cy.findByRole('textbox', { name: 'Tags (separated by a comma)' }).type(
      'Test, Event, Tag',
    );
    // TODO: it shouldn't be necessary to clear the date textboxes - the page needs to
    // be fixed
    cy.findByRole('textbox', { name: 'Start at' }).clear().type(fix.startAt);
    cy.findByRole('textbox', { name: 'End at' }).clear().type(fix.endAt);
    // TODO: figure out why cypress thinks this is covered.
    // cy.findByRole('checkbox', { name: 'Invite only' }).click();
    cy.get('[data-cy="invite-only-checkbox"]').click();
    // TODO: I thought <select> would be a listbox - does it matter that it's a
    // combobox?
    cy.findByRole('combobox', { name: 'Venue' })
      .as('venueSelect')
      .select(fix.venueId);
    cy.get('@venueSelect')
      .find(`option[value=${fix.venueId}]`)
      .invoke('text')
      .as('venueTitle');

    cy.findByRole('form', { name: 'Add event' }).submit();
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d/);
    // confirm that the test data appears in the new event
    cy.wrap(Object.entries(fix)).each(([key, value]) => {
      // TODO: remove this conditional when tags and dates are handled properly.
      if (!['tags', 'startAt', 'endAt'].includes(key)) {
        cy.contains(value);
      }
    });
  });
});
