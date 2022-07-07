// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-wait-until';
import 'cypress-mailhog';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('registerViaUI', (firstName, lastName, email) => {
  cy.visit('/auth/register');

  cy.get('input[name="first_name"]').type(firstName);
  cy.get('input[name="last_name"]').type(lastName);
  cy.get('input[name="email"]').type(email);
  cy.get('[data-cy="submit-button"]').click();
});

Cypress.Commands.add('login', (token) => {
  const authData = {
    operationName: 'authenticate',
    variables: {
      token: token ?? Cypress.env('JWT'),
    },
    query: `mutation authenticate($token: String!) {
        authenticate(token: $token) {
          token
          user {
            id
            first_name
            last_name
          }
        }
      }`,
  };
  cy.request('POST', 'http://localhost:5000/graphql', authData).then(
    (response) => {
      expect(response.body.data.authenticate).to.have.property('token');
      // TODO: change this to set a cookie when Token.tsx is updated.
      window.localStorage.setItem(
        'token',
        response.body.data.authenticate.token,
      );
      expect(response.status).to.eq(200);
    },
  );
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('token');
});

Cypress.Commands.add('register', (firstName, lastName, email) => {
  const user = {
    operationName: 'register',
    variables: {
      first_name: firstName ?? 'Test',
      last_name: lastName ?? 'User',
      email: email ?? 'test@user.org',
    },
    query:
      'mutation register($email: String!, $first_name: String!, $last_name: String!) {\n  register(data: {email: $email, first_name: $first_name, last_name: $last_name}) {\n    id\n    __typename\n  }\n}\n',
  };

  cy.request('POST', 'http://localhost:5000/graphql', user).then((response) => {
    expect(response.body.data.register).to.have.property('id');
    expect(response.body.data.register).to.have.property('__typename', 'User');
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('interceptGQL', (operationName) => {
  cy.intercept('http://localhost:5000/graphql', (req) => {
    if (req.body?.operationName?.includes(operationName)) {
      req.alias = `GQL${operationName}`;
    }
  });
});

Cypress.Commands.add('getChapterMembers', (chapterId) => {
  const chapterQuery = {
    operationName: 'chapterUsers',
    variables: {
      chapterId,
    },
    query: `query chapterUsers($chapterId: Int!) {
      chapter(id: $chapterId) {
        chapter_users {
          user {
            name
            email
          }
          subscribed
        }
      }
    }`,
  };
  return cy
    .request('POST', 'http://localhost:5000/graphql', chapterQuery)
    .then((response) => response.body.data.chapter.chapter_users);
});

Cypress.Commands.add('getEventUsers', (eventId) => {
  const eventQuery = {
    operationName: 'eventUsers',
    variables: {
      eventId,
    },
    query: `query eventUsers($eventId: Int!) {
      event(eventId: $eventId) {
        event_users {
          rsvp {
            name
          }
          user {
            id
            name
            email
          }
          subscribed
        }
      }
    }`,
  };
  return cy
    .request('POST', 'http://localhost:5000/graphql', eventQuery)
    .then((response) => response.body.data.event.event_users);
});

Cypress.Commands.add('waitUntilMail', (alias) => {
  cy.waitUntil(() =>
    alias
      ? cy
          .mhGetAllMails()
          .as(alias)
          .then((mails) => mails?.length > 0)
      : cy.mhGetAllMails().then((mails) => mails?.length > 0),
  );
});

Cypress.Commands.add('createEvent', (data) => {
  const eventMutation = {
    operationName: 'createEvent',
    variables: {
      data: { ...data },
    },
    query: `mutation createEvent($data: CreateEventInputs!) {
      createEvent(data: $data) {
        id
      }
    }`,
  };
  const requestOptions = {
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: eventMutation,
  };
  return cy.authedRequest(requestOptions).then((response) => {
    return response.body.data.createEvent.id;
  });
});

Cypress.Commands.add('createChapter', (data) => {
  const createChapterData = {
    operationName: 'createChapter',
    variables: {
      data,
    },
    query: `mutation createChapter($data: CreateChapterInputs!) {
      createChapter(data: $data) {
        id
        name
        description
        city
        region
        country
        chatUrl
      }
    }
  `,
  };
  const requestOptions = {
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: createChapterData,
  };

  return cy.authedRequest(requestOptions);
});

Cypress.Commands.add('updateChapter', (chapterId, data) => {
  const chapterMutation = {
    operationName: 'updateChapter',
    variables: {
      id: chapterId,
      data: { ...data },
    },
    query: `mutation updateChapter($id: Int!, $data: UpdateChapterInputs!) {
      updateChapter(id: $id, data: $data) {
        id
      }
    }`,
  };
  const requestOptions = {
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: chapterMutation,
  };

  return cy.authedRequest(requestOptions);
});

Cypress.Commands.add('deleteEvent', (eventId) => {
  const eventMutation = {
    operationName: 'deleteEvent',
    variables: {
      eventId,
    },
    query: `mutation deleteEvent($eventId: Int!) {
      deleteEvent(id: $eventId) {
        id
      }
    }`,
  };
  return cy
    .request('POST', 'http://localhost:5000/graphql', eventMutation)
    .then((response) => response.body.data.deleteEvent.id);
});

Cypress.Commands.add('checkBcc', (mail) => {
  const headers = mail.Content.Headers;
  return cy.wrap(!('To' in headers));
});

Cypress.Commands.add(
  'rsvpToEvent',
  ({ eventId, chapterId }, options = { withAuth: true }) => {
    const rsvpMutation = {
      operationName: 'rsvpToEvent',
      variables: {
        eventId,
        chapterId,
      },
      query: `
    mutation rsvpToEvent($eventId: Int!, $chapterId: Int!) {
      rsvpEvent(eventId: $eventId, chapterId: $chapterId) {
        updated_at
      }
    }
    `,
    };

    const requestOptions = {
      method: 'POST',
      url: 'http://localhost:5000/graphql',
      body: rsvpMutation,
      failOnStatusCode: false,
    };

    return options.withAuth
      ? cy.authedRequest(requestOptions)
      : cy.request(requestOptions);
  },
);

Cypress.Commands.add('deleteRsvp', (eventId, userId) => {
  const kickMutation = {
    operationName: 'deleteRsvp',
    variables: {
      eventId,
      userId,
    },
    query: `mutation deleteRsvp($eventId: Int!, $userId: Int!) {
      deleteRsvp(eventId: $eventId, userId: $userId)
    }`,
  };
  return cy.authedRequest({
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: kickMutation,
  });
});

Cypress.Commands.add('confirmRsvp', (eventId, userId) => {
  const confirmMutation = {
    operationName: 'confirmRsvp',
    variables: {
      eventId,
      userId,
    },
    query: `mutation confirmRsvp($eventId: Int!, $userId: Int!) {
      confirmRsvp(eventId: $eventId, userId: $userId) {
        rsvp {
          updated_at
          name
        }
      }
    }`,
  };
  return cy.authedRequest({
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: confirmMutation,
  });
});

Cypress.Commands.add('authedRequest', (options) => {
  return cy.request({
    ...options,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  });
});

Cypress.Commands.add('createSponsor', (data) => {
  const createSponsorData = {
    operationName: 'createSponsor',
    variables: { data },
    query: `mutation createSponsor($data: CreateSponsorInputs!) {
      createSponsor(data: $data) {
        id
      }
    }`,
  };
  const requestOptions = {
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: createSponsorData,
  };
  return cy.authedRequest(requestOptions);
});

Cypress.Commands.add('updateSponsor', (id, data) => {
  const updateSponsorData = {
    operationName: 'updateSponsor',
    variables: { id, data },
    query: `mutation updateSponsor($id: Int!, $data: UpdateSponsorInputs!) {
      updateSponsor(id: $id, data: $data) {
        id
      }
    }`,
  };
  const requestOptions = {
    method: 'POST',
    url: 'http://localhost:5000/graphql',
    body: updateSponsorData,
  };
  return cy.authedRequest(requestOptions);
});
