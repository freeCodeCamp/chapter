/* eslint-disable @typescript-eslint/no-namespace */
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

import { gqlOptions } from './util';

/**
 * Register user using page UI
 */
const registerViaUI = (firstName: string, lastName: string, email: string) => {
  cy.visit('/auth/register');

  cy.get('input[name="first_name"]').type(firstName);
  cy.get('input[name="last_name"]').type(lastName);
  cy.get('input[name="email"]').type(email);
  cy.get('[data-cy="submit-button"]').click();
};

Cypress.Commands.add('registerViaUI', registerViaUI);

/**
 * Create user session
 */
const login = () => {
  return cy
    .request({
      url: Cypress.env('SERVER_URL') + '/login',
      method: 'POST',
      headers: {
        Authorization: `Bearer dummy-token`,
      },
    })
    .then(() => cy.reload());
};
Cypress.Commands.add('login', login);

/**
 * Change the current development user
 * @param email Email of the new user
 */

const changeUser = (email?: string) => {
  // Currently changing users modifies the dev-data.json file and that file
  // needs _not_ to be watched by node-dev. If we change how we store dev users
  // that can be watched again.
  return email
    ? cy.exec(`npm run change-user -- ${email} `)
    : cy.exec('npm run change-user:owner');
};
Cypress.Commands.add('changeUser', changeUser);

const logout = () => {
  window.localStorage.removeItem('token');
};
Cypress.Commands.add('logout', logout);

/**
 * Register user using GQL query
 */
const register = (firstName?: string, lastName?: string, email?: string) => {
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

  cy.request(gqlOptions(user)).then((response) => {
    expect(response.body.data.register).to.have.property('id');
    expect(response.body.data.register).to.have.property('__typename', 'User');
    expect(response.status).to.eq(200);
  });
};

Cypress.Commands.add('register', register);

/**
 * Intercept GQL request
 * @param operationName Name of GQL operation to intercept
 */
const interceptGQL = (operationName: string) => {
  cy.intercept(Cypress.env('GQL_URL'), (req) => {
    if (req.body?.operationName?.includes(operationName)) {
      req.alias = `GQL${operationName}`;
    }
  });
};
Cypress.Commands.add('interceptGQL', interceptGQL);

/**
 * Get users of the chapter using GQL query
 * @param chapterId Id of the chapter
 */
const getChapterMembers = (chapterId: number) => {
  const chapterQuery = {
    operationName: 'chapterUsers',
    variables: {
      chapterId,
    },
    query: `query chapterUsers($chapterId: Int!) {
            chapter(id: $chapterId) {
              chapter_users {
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
    .request(gqlOptions(chapterQuery))
    .then((response) => response.body.data.chapter.chapter_users);
};
Cypress.Commands.add('getChapterMembers', getChapterMembers);

/**
 * Get event users for event with eventId using GQL query
 * @param eventId Id of the event
 */
const getEventUsers = (eventId: number) => {
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
    .request(gqlOptions(eventQuery))
    .then((response) => response.body.data.event.event_users);
};

Cypress.Commands.add('getEventUsers', getEventUsers);

/**
 * Wait until emails are received by mailhog
 * @param alias Name of the alias to reference emails by
 */
const waitUntilMail = (alias?: string) => {
  cy.waitUntil(() =>
    alias
      ? cy
          .mhGetAllMails()
          .as(alias)
          .then((mails) => mails?.length > 0)
      : cy.mhGetAllMails().then((mails) => mails?.length > 0),
  );
};

Cypress.Commands.add('waitUntilMail', waitUntilMail);

/**
 * Create event using GQL mutation
 * @param chapterId Id of the chapter
 * @param data Data of the event. Equivalent of CreateEventInputs for the Events resolver.
 */
const createEvent = (chapterId: number, data: { [index: string]: unknown }) => {
  const eventMutation = {
    operationName: 'createEvent',
    variables: {
      chapterId,
      data,
    },
    query: `mutation createEvent($chapterId: Int!, $data: CreateEventInputs!) {
      createEvent(chapterId: $chapterId, data: $data) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(eventMutation));
};
Cypress.Commands.add('createEvent', createEvent);

/**
 * Create chapter using GQL mutation
 * @param data Data of the chapter. Equivalent of CreateChapterInputs for the Chapter resolver.
 */
const createChapter = (data) => {
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
  return cy.authedRequest(gqlOptions(createChapterData));
};
Cypress.Commands.add('createChapter', createChapter);

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
  return cy.authedRequest(gqlOptions(chapterMutation));
});
/**
 * Update event using GQL mutation
 * @param eventId Id of the event
 * @param data Data of the event. Equivalent of CreateEventInputs for the Events resolver.
 */
const updateEvent = (eventId, data) => {
  const eventMutation = {
    operationName: 'updateEvent',
    variables: {
      eventId,
      data,
    },
    query: `mutation updateEvent($eventId: Int!, $data: UpdateEventInputs!) {
      updateEvent(id: $eventId, data: $data) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(eventMutation));
};
Cypress.Commands.add('updateEvent', updateEvent);
/**
 * Delete event using GQL mutation
 * @param eventId Id of the event for deletion
 */
const deleteEvent = (eventId: number) => {
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
  return cy.authedRequest(gqlOptions(eventMutation));
};
Cypress.Commands.add('deleteEvent', deleteEvent);

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

    const requestOptions = gqlOptions(rsvpMutation, {
      failOnStatusCode: false,
    });

    return options.withAuth
      ? cy.authedRequest(requestOptions)
      : cy.request(requestOptions);
  },
);

Cypress.Commands.add(
  'subscribeToEvent',
  ({ eventId }, options = { withAuth: true }) => {
    const subscribeMutation = {
      operationName: 'subscribeToEvent',
      variables: {
        eventId,
      },
      query: `
    mutation subscribeToEvent($eventId: Int!) {
      subscribeToEvent(eventId: $eventId) {
        subscribed
      }
    }
  `,
    };

    return options.withAuth
      ? cy.authedRequest(gqlOptions(subscribeMutation))
      : cy.request(gqlOptions(subscribeMutation));
  },
);

Cypress.Commands.add(
  'unsubscribeFromEvent',
  ({ eventId }, options = { withAuth: true }) => {
    const unsubscribeMutation = {
      operationName: 'unsubscribeFromEvent',
      variables: {
        eventId,
      },
      query: `
    mutation unsubscribeFromEvent($eventId: Int!) {
      unsubscribeFromEvent(eventId: $eventId) {
        subscribed
      }
    }
  `,
    };

    return options.withAuth
      ? cy.authedRequest(gqlOptions(unsubscribeMutation))
      : cy.request(gqlOptions(unsubscribeMutation));
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
  return cy.authedRequest(gqlOptions(kickMutation));
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
  return cy.authedRequest(gqlOptions(confirmMutation));
});

Cypress.Commands.add(
  'createVenue',
  ({ chapterId }, data, options = { withAuth: true }) => {
    const queryData = {
      operationName: 'createVenue',
      variables: {
        chapterId,
        data,
      },
      query: `mutation createVenue($chapterId: Int!, $data: CreateVenueInputs!) {
      createVenue(chapterId: $chapterId, data: $data) {
        id
      }
    }`,
    };

    const requestOptions = gqlOptions(queryData);

    return options.withAuth
      ? cy.authedRequest(requestOptions)
      : cy.request(requestOptions);
  },
);

Cypress.Commands.add(
  'updateVenue',
  ({ chapterId, venueId }, data, options = { withAuth: true }) => {
    const queryData = {
      operationName: 'updateVenue',
      variables: {
        chapterId,
        venueId,
        data,
      },
      query: `mutation updateVenue($chapterId: Int!, $venueId: Int!, $data: UpdateVenueInputs!) {
      updateVenue(chapterId: $chapterId, venueId: $venueId, data: $data) {
        id
      }
    }`,
    };
    const requestOptions = gqlOptions(queryData);

    return options.withAuth
      ? cy.authedRequest(requestOptions)
      : cy.request(requestOptions);
  },
);

/**
 * Delete venue using GQL mutation
 * @param chapterId Id of the chapter
 * @param venueId Id of the venue
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const deleteVenue = (
  { chapterId, venueId }: { chapterId: number; venueId: number },
  options = { withAuth: true },
) => {
  const queryData = {
    operationName: 'deleteVenue',
    variables: {
      chapterId,
      venueId,
    },
    query: `mutation deleteVenue($chapterId: Int!, $venueId: Int!) {
    deleteVenue(chapterId: $chapterId, venueId: $venueId) {
      id
    }
  }`,
  };
  const requestOptions = gqlOptions(queryData);

  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('deleteVenue', deleteVenue);

/**
 * Auth request, with token of the logged in user, before sending it.
 * @param options Request options
 */
const authedRequest = (options) => {
  return cy.request({
    ...options,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  });
};
Cypress.Commands.add('authedRequest', authedRequest);

/**
 * Create sponsor using GQL mutation
 * @param data Data of the sponsor. Equivalent of CreateSponsorInputs for the Sponsor resolver.
 */
const createSponsor = (data) => {
  const createSponsorData = {
    operationName: 'createSponsor',
    variables: { data },
    query: `mutation createSponsor($data: CreateSponsorInputs!) {
      createSponsor(data: $data) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(createSponsorData));
};
Cypress.Commands.add('createSponsor', createSponsor);

/**
 * Update sponsor using GQL mutation
 * @param id Sponsor id
 * @param data Data of the sponsor. Equivalent of UpdateSponsorInputs for the Sponsor resolver.
 */
const updateSponsor = (id: number, data) => {
  const updateSponsorData = {
    operationName: 'updateSponsor',
    variables: { id, data },
    query: `mutation updateSponsor($id: Int!, $data: UpdateSponsorInputs!) {
      updateSponsor(id: $id, data: $data) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(updateSponsorData));
};
Cypress.Commands.add('updateSponsor', updateSponsor);

/**
 * Get events for chapter using GQL query
 * @param id Chapter id
 */
const getChapterEvents = (id: number) => {
  const chapterQuery = {
    operationName: 'chapter',
    variables: { id },
    query: `query chapter($id: Int!) {
      chapter(id: $id) {
        events {
          id
        }
      }
    }`,
  };
  return cy
    .request(gqlOptions(chapterQuery))
    .then((response) => response.body.data.chapter.events);
};
Cypress.Commands.add('getChapterEvents', getChapterEvents);

/**
 * Join chapter using GQL mutation
 * @param chapterId Chapter id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const joinChapter = (chapterId: number, options = { withAuth: true }) => {
  const chapterUserMutation = {
    operationName: 'joinChapter',
    variables: { chapterId },
    query: `mutation joinChapter($chapterId: Int!) {
      joinChapter(chapterId: $chapterId) {
        user_id
      }
    }`,
  };
  const requestOptions = gqlOptions(chapterUserMutation);

  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('joinChapter', joinChapter);

/**
 * Toggle subscription status for chapter using GQL mutation
 * @param chapterId Chapter id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const toggleChapterSubscription = (
  chapterId: number,
  options = { withAuth: true },
) => {
  const chapterUserMutation = {
    operationName: 'toggleChapterSubscription',
    variables: { chapterId },
    query: `mutation toggleChapterSubscription($chapterId: Int!) {
      toggleChapterSubscription(chapterId: $chapterId) {
        user_id
      }
    }`,
  };
  const requestOptions = gqlOptions(chapterUserMutation);
  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('toggleChapterSubscription', toggleChapterSubscription);

/**
 * Change chapter user role using GQL mutation
 * @param data Data about change
 * @param data.chapterId Chapter id
 * @param data.roleId Role id
 * @param data.userId User id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const changeChapterUserRole = (
  {
    chapterId,
    roleId,
    userId,
  }: { chapterId: number; roleId: number; userId: number },
  options = { withAuth: true },
) => {
  const chapterUserRoleMutation = {
    operationName: 'changeChapterUserRole',
    variables: { chapterId, roleId, userId },
    query: `mutation changeChapterUserRole($chapterId: Int!, $roleId: Int!, $userId: Int!) {
      changeChapterUserRole(chapterId: $chapterId, roleId: $roleId, userId: $userId) {
        chapter_role {
          id
        }
      }
    }`,
  };
  const requestOptions = gqlOptions(chapterUserRoleMutation);
  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('changeChapterUserRole', changeChapterUserRole);

/**
 * Get chapter roles using GQL query
 */
const getChapterRoles = () => {
  const chapterRolesQuery = {
    operationName: 'chapterRoles',
    query: `query chapterRoles {
      chapterRoles {
        id
        name
      }
    }`,
  };
  return cy
    .request(gqlOptions(chapterRolesQuery))
    .then((response) => response.body.data.chapterRoles);
};
Cypress.Commands.add('getChapterRoles', getChapterRoles);

// Cypress will add these commands to the Cypress object, correctly, but it
// cannot infer the types, so we need to add them manually.
declare global {
  namespace Cypress {
    interface Chainable {
      authedRequest: typeof authedRequest;
      changeChapterUserRole: typeof changeChapterUserRole;
      changeUser: typeof changeUser;
      createChapter: typeof createChapter;
      createEvent: typeof createEvent;
      createSponsor: typeof createSponsor;
      deleteEvent: typeof deleteEvent;
      deleteVenue: typeof deleteVenue;
      getChapterEvents: typeof getChapterEvents;
      getChapterMembers: typeof getChapterMembers;
      getChapterRoles: typeof getChapterRoles;
      getEventUsers: typeof getEventUsers;
      interceptGQL: typeof interceptGQL;
      joinChapter: typeof joinChapter;
      login: typeof login;
      logout: typeof logout;
      register: typeof register;
      registerViaUI: typeof registerViaUI;
      toggleChapterSubscription: typeof toggleChapterSubscription;
      updateSponsor: typeof updateSponsor;
      waitUntilMail: typeof waitUntilMail;
    }
  }
}
