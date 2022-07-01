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

describe('chapter dashboard', () => {
  it('should have link to add event for chapter', () => {
    cy.visit('/dashboard/chapters/1');
    cy.get('a[href="/dashboard/chapters/1/new_event"').should('be.visible');
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
});
