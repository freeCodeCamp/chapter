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

import 'cypress-mailhog';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('register', (firstName, lastName, email) => {
  cy.visit('/auth/register');

  cy.get('input[name="first_name"]').type(firstName);
  cy.get('input[name="last_name"]').type(lastName);
  cy.get('input[name="email"]').type(email);
  cy.get('[data-cy="submit-button"]').click();
});

Cypress.Commands.add('login', () => {
  cy.interceptGQL('authenticate');
  cy.visit(`http://localhost:3000/auth/token?token=${Cypress.env('JWT')}`);
  cy.wait('@GQLauthenticate')
    .its('response')
    .then((response) => {
      cy.wrap(response.body.data.authenticate).should('have.property', 'token');
      cy.wrap(response.statusCode).should('eq', 200);
      // TODO: change this to set a cookie when Token.tsx is updated.
      window.localStorage.setItem(
        'token',
        response.body.data.authenticate.token,
      );
    });
});

Cypress.Commands.add('interceptGQL', (operationName) => {
  cy.intercept('http://localhost:5000/graphql', (req) => {
    if (req.body?.operationName?.includes(operationName)) {
      req.alias = `GQL${operationName}`;
    }
  });
});
