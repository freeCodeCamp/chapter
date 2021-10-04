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
      id: chapterId,
    },
    query: `query chapterUsers($id: Int!) {
      chapter(id: $id) {
        users {
          user {
            name
            email
          }
          interested
        }
      }
    }`,
  };
  return cy
    .request('POST', 'http://localhost:5000/graphql', chapterQuery)
    .then((response) => response.body.data.chapter.users);
});

Cypress.Commands.add('getRSVPs', (eventId) => {
  const chapterQuery = {
    operationName: 'rsvpsForEvent',
    variables: {
      id: eventId,
    },
    query: `query rsvpsForEvent($id: Int!) {
      event(id: $id) {
        rsvps {
          on_waitlist
          canceled
          user {
            id
            name
            email
          }
        }
      }
    }`,
  };
  return cy
    .request('POST', 'http://localhost:5000/graphql', chapterQuery)
    .then((response) => response.body.data.event.rsvps);
});

Cypress.Commands.add('waitUntilMail', (alias) => {
  cy.waitUntil(() =>
    cy
      .mhGetAllMails()
      .as(alias)
      .then((mails) => mails?.length > 0),
  );
});
