import { expectToBeRejected } from '../../../../support/util';

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

// TODO: Consolidate fixtures.
const eventData = {
  venue_id: 1,
  sponsor_ids: [],
  name: 'Other Event',
  description: 'Test Description',
  url: 'https://test.event.org',
  venue_type: 'PhysicalAndOnline',
  capacity: 10,
  image_url: 'https://test.event.org/image',
  streaming_url: 'https://test.event.org/video',
  start_at: '2022-01-01T00:01',
  ends_at: '2022-01-02T00:02',
  tags: 'Test, Event, Tag',
  invite_only: false,
};

describe('chapter dashboard', () => {
  beforeEach(() => {
    cy.exec('npm run db:seed');
    cy.login();
    cy.mhDeleteAll();
  });

  it('should have link to add event for chapter', () => {
    cy.visit('/dashboard/chapters/1');
    cy.get('a[href="/dashboard/chapters/1/new-event"').should('be.visible');
  });

  it('emails interested users when an event is created', () => {
    createEventViaUI(1);
    cy.location('pathname').should('match', /^\/dashboard\/events\/\d+$/);
    // confirm that the test data appears in the new event
    Object.entries(testEvent).forEach(([key, value]) => {
      // TODO: simplify this conditional when tags and dates are handled
      // properly.
      if (!['tags', 'startAt', 'endAt', 'venueId'].includes(key)) {
        cy.contains(value);
      }
    });
    // check that the title we selected is in the event we created.

    // The type has to be set, since TS can't infer that the alias is to a
    // string
    cy.get<string>('@venueTitle').then((venueTitle) => {
      cy.contains(venueTitle);
    });

    // check that the subscribed users have been emailed
    cy.waitUntilMail('allMail');

    // TODO: select chapter during event creation and use that here (much like @venueTitle
    // ) i.e. remove the hardcoding.
    cy.getChapterMembers(1).then((members) => {
      const subscriberEmails = members
        .filter(({ subscribed }) => subscribed)
        .map(({ user: { email } }) => email);
      cy.get('@allMail').should('have.length', subscriberEmails.length);
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

  it('prevents members and admins from other chapters from creating events', () => {
    let chapterId = 2;
    // normal member
    cy.register();
    cy.login(Cypress.env('JWT_TEST_USER'));
    cy.createEvent(chapterId, eventData).then(expectToBeRejected);

    // admin of a different chapter
    cy.login(Cypress.env('JWT_ADMIN_USER'));
    cy.createEvent(2, eventData).then(expectToBeRejected);

    // switch the chapterId to match the admin's chapter
    chapterId = 1;
    cy.createEvent(chapterId, {
      ...eventData,
      name: 'Created by Admin',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.errors).not.to.exist;

      cy.visit(`/dashboard/events/`);
      cy.contains('Created by Admin');
      cy.contains(eventData.name).should('not.exist');
    });
  });

  function createEventViaUI(chapterId) {
    cy.visit(`/dashboard/chapters/${chapterId}`);
    cy.get(`a[href="/dashboard/chapters/${chapterId}/new-event"]`).click();
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
