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
import { EventInputs } from './../../client/src/generated/graphql';

/**
 * Register user using page UI
 */
const registerViaUI = (name: string, email: string) => {
  cy.visit('/auth/register');

  cy.get('input[name="name"]').type(name);
  cy.get('input[name="email"]').type(email);
  cy.get('[data-cy="submit-button"]').click();
};

Cypress.Commands.add('registerViaUI', registerViaUI);

/**
 * Create new user session
 * @param email Email of the new user
 */
const login = (email?: string) => {
  // Currently changing users modifies the current-user.json file and that file
  // needs _not_ to be watched by node-dev. If we change how we store dev users
  // that can be watched again.
  email
    ? cy.exec(`npm run change-user -- ${email} `)
    : cy.exec('npm run change-user:owner');
  localStorage.setItem('dev-login-authenticated', 'true');
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

const logout = () => {
  localStorage.removeItem('dev-login-authenticated');
  cy.request({
    url: Cypress.env('SERVER_URL') + '/logout',
    method: 'DELETE',
  }).then(() => cy.reload());
};
Cypress.Commands.add('logout', logout);

/**
 * Register user using GQL query
 */
const register = (name?: string, email?: string) => {
  const user = {
    operationName: 'register',
    variables: {
      name: name ?? 'Test User',
      email: email ?? 'test@user.org',
    },
    query: `mutation register($email: String!, $name: String!) {
      register(data: {email: $email, name: $name}) {
        id
        __typename
      }
    }`,
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
 * Wait until emails are received by mailhog
 * @param alias Name of the alias to reference emails by
 */

function waitUntilMail(args?: {
  alias?: string;
  expectedNumberOfEmails: number;
}) {
  const { alias, expectedNumberOfEmails = 1 } = args ?? {};
  const checkMail = (mails: mailhog.Item[]) =>
    mails?.length >= expectedNumberOfEmails ? mails : false;
  return cy.waitUntil(() =>
    alias
      ? cy.mhGetAllMails().as(alias).then(checkMail)
      : cy.mhGetAllMails().then(checkMail),
  );
}

Cypress.Commands.add('waitUntilMail', waitUntilMail);

/**
 * Create event using GQL mutation
 * @param chapterId Id of the chapter
 * @param data Data of the event. Defined by the GraphQL input type EventInputs.
 */
const createEvent = (
  chapterId: number,
  data: EventInputs,
  attendEvent = true,
) => {
  const eventMutation = {
    operationName: 'createEvent',
    variables: {
      chapterId,
      data,
      attendEvent,
    },
    query: `mutation createEvent($chapterId: Int!, $data: EventInputs!, $attendEvent: Boolean!) {
      createEvent(chapterId: $chapterId, data: $data, attendEvent: $attendEvent) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(eventMutation));
};
Cypress.Commands.add('createEvent', createEvent);

/**
 * Create chapter using GQL mutation
 * @param data Data of the chapter. Equivalent of ChapterInputs for the Chapter resolver.
 */
const createChapter = (data) => {
  const createChapterData = {
    operationName: 'createChapter',
    variables: {
      data,
    },
    query: `mutation createChapter($data: ChapterInputs!) {
      createChapter(data: $data) {
        id
        name
        description
        city
        region
        country
        chat_url
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
    query: `mutation updateChapter($id: Int!, $data: ChapterInputs!) {
      updateChapter(id: $id, data: $data) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(chapterMutation));
});
/**
 * Delete chapter using GQL mutation
 * @param chapterId Id of the chapter for deletion
 */
const deleteChapter = (chapterId: number) => {
  const chapterMutation = {
    operationName: 'deleteChapter',
    variables: {
      chapterId,
    },
    query: `mutation deleteChapter($chapterId: Int!) {
      deleteChapter(id: $chapterId) {
        id
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(chapterMutation));
};
Cypress.Commands.add('deleteChapter', deleteChapter);
/**
 * Update event using GQL mutation
 * @param eventId Id of the event
 * @param data Data of the event. Equivalent of EventInputs for the Events resolver.
 */
const updateEvent = (eventId, data) => {
  const eventMutation = {
    operationName: 'updateEvent',
    variables: {
      eventId,
      data,
    },
    query: `mutation updateEvent($eventId: Int!, $data: EventInputs!) {
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
  'attendEvent',
  ({ eventId, chapterId }, options = { withAuth: true }) => {
    const attendMutation = {
      operationName: 'attendEvent',
      variables: {
        eventId,
        chapterId,
      },
      query: `
    mutation attendEvent($eventId: Int!, $chapterId: Int!) {
      attendEvent(eventId: $eventId, chapterId: $chapterId) {
        updated_at
      }
    }
    `,
    };

    const requestOptions = gqlOptions(attendMutation, {
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

Cypress.Commands.add('deleteAttendee', (eventId, userId) => {
  const removeMutation = {
    operationName: 'deleteAttendee',
    variables: {
      eventId,
      userId,
    },
    query: `mutation deleteAttendee($eventId: Int!, $userId: Int!) {
      deleteAttendee(eventId: $eventId, userId: $userId)
    }`,
  };
  return cy.authedRequest(gqlOptions(removeMutation));
});

Cypress.Commands.add('confirmAttendee', (eventId, userId) => {
  const confirmMutation = {
    operationName: 'confirmAttendee',
    variables: {
      eventId,
      userId,
    },
    query: `mutation confirmAttendee($eventId: Int!, $userId: Int!) {
      confirmAttendee(eventId: $eventId, userId: $userId) {
        attendance {
          updated_at
          name
        }
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(confirmMutation));
});

/**
 * Move attendee with userId to the waitlist for the event with eventId
 * @param eventId Id of the event
 * @param userId Id of the user
 */
const moveAttendeeToWaitlist = (eventId, userId) => {
  const moveAttendeeMutation = {
    operationName: 'moveAttendeeToWaitlist',
    variables: {
      eventId,
      userId,
    },
    query: `mutation moveAttendeeToWaitlist($eventId: Int!, $userId: Int!) {
      moveAttendeeToWaitlist(eventId: $eventId, userId: $userId) {
        attendance {
          updated_at
          name
        }
      }
    }`,
  };
  return cy.authedRequest(gqlOptions(moveAttendeeMutation));
};

Cypress.Commands.add('moveAttendeeToWaitlist', moveAttendeeToWaitlist);

Cypress.Commands.add(
  'createVenue',
  ({ chapterId }, data, options = { withAuth: true }) => {
    const queryData = {
      operationName: 'createVenue',
      variables: {
        chapterId,
        data,
      },
      query: `mutation createVenue($chapterId: Int!, $data: VenueInputs!) {
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
      query: `mutation updateVenue($chapterId: Int!, $venueId: Int!, $data: VenueInputs!) {
      updateVenue(_onlyUsedForAuth: $chapterId, id: $venueId, data: $data) {
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
    deleteVenue(_onlyUsedForAuth: $chapterId, id: $venueId) {
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
 * Get venues for chapter using GQL query
 * @param id Chapter id
 */
const getChapterVenues = (id: number) => {
  const chapterVenuesQuery = {
    operationName: 'chapterVenues',
    variables: { id },
    query: `query chapterVenues($id: Int!) {
      chapterVenues(chapterId: $id) {
        id
      }
    }`,
  };
  return cy
    .authedRequest(gqlOptions(chapterVenuesQuery))
    .then((response) => response.body.data.chapterVenues);
};
Cypress.Commands.add('getChapterVenues', getChapterVenues);

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
 * Leave chapter using GQL mutation
 * @param chapterId Chapter id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const leaveChapter = (chapterId: number, options = { withAuth: true }) => {
  const chapterUserMutation = {
    operationName: 'leaveChapter',
    variables: { chapterId },
    query: `mutation leaveChapter($chapterId: Int!) {
      leaveChapter(chapterId: $chapterId) {
        user_id
      }
    }`,
  };
  const requestOptions = gqlOptions(chapterUserMutation);

  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('leaveChapter', leaveChapter);

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
 * @param data.roleName Role name
 * @param data.userId User id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const changeChapterUserRole = (
  {
    chapterId,
    roleName,
    userId,
  }: { chapterId: number; roleName: string; userId: number },
  options = { withAuth: true },
) => {
  const chapterUserRoleMutation = {
    operationName: 'changeChapterUserRole',
    variables: { chapterId, roleName, userId },
    query: `mutation changeChapterUserRole($chapterId: Int!, $roleName: String!, $userId: Int!) {
      changeChapterUserRole(chapterId: $chapterId, roleName: $roleName, userId: $userId) {
        chapter_role {
          name
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
 * Change user instance role using GQL mutation
 * @param data Data about change
 * @param data.roleName Role name
 * @param data.userId User id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const changeInstanceUserRole = (
  { roleName, userId }: { roleName: string; userId: number },
  options = { withAuth: true },
) => {
  const instanceUserRoleMutation = {
    operationName: 'changeInstanceUserRole',
    variables: { roleName, userId },
    query: `mutation changeInstanceUserRole($roleName: String!, $userId: Int!) {
      changeInstanceUserRole(roleName: $roleName, id: $userId) {
        instance_role {
          name
        }
      }
    }`,
  };
  const requestOptions = gqlOptions(instanceUserRoleMutation);
  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('changeInstanceUserRole', changeInstanceUserRole);

/**
 * Ban user using GQL mutation
 * @param data.chapterId Chapter id
 * @param data.userId User id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const banUser = (
  { chapterId, userId }: { chapterId: number; userId: number },
  options = { withAuth: true },
) => {
  const banUserMutation = {
    operationName: 'banUser',
    variables: { chapterId, userId },
    query: `mutation banUser($chapterId: Int!, $userId: Int!) {
      banUser(chapterId: $chapterId, userId: $userId) {
        user_id
      }
    }`,
  };
  const requestOptions = gqlOptions(banUserMutation);
  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('banUser', banUser);

/**
 * Unban user using GQL mutation
 * @param data.chapterId Chapter id
 * @param data.userId User id
 * @param {object} [options={ withAuth: boolean }] Optional options object.
 */
const unbanUser = (
  { chapterId, userId }: { chapterId: number; userId: number },
  options = { withAuth: true },
) => {
  const unbanUserMutation = {
    operationName: 'unbanUser',
    variables: { chapterId, userId },
    query: `mutation unbanUser($chapterId: Int!, $userId: Int!) {
      unbanUser(chapterId: $chapterId, userId: $userId) {
        user_id
      }
    }`,
  };
  const requestOptions = gqlOptions(unbanUserMutation);
  return options.withAuth
    ? cy.authedRequest(requestOptions)
    : cy.request(requestOptions);
};
Cypress.Commands.add('unbanUser', unbanUser);

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

/**
 * sends event invites for attendees
 * @param eventId event id
 */
const sendEventInvite = (eventId: number) => {
  const sendEventInviteMutation = {
    operationName: 'sendEventInvite',
    variables: { eventId },
    query: `mutation sendEventInvite($eventId: Int!) {
      sendEventInvite(id: $eventId)
    }`,
  };
  return cy.authedRequest(gqlOptions(sendEventInviteMutation));
};
Cypress.Commands.add('sendEventInvite', sendEventInvite);

// Cypress will add these commands to the Cypress object, correctly, but it
// cannot infer the types, so we need to add them manually.
declare global {
  namespace Cypress {
    interface Chainable {
      authedRequest: typeof authedRequest;
      banUser: typeof banUser;
      changeChapterUserRole: typeof changeChapterUserRole;
      changeInstanceUserRole: typeof changeInstanceUserRole;
      createChapter: typeof createChapter;
      createEvent: typeof createEvent;
      createSponsor: typeof createSponsor;
      deleteChapter: typeof deleteChapter;
      deleteEvent: typeof deleteEvent;
      deleteVenue: typeof deleteVenue;
      sendEventInvite: typeof sendEventInvite;
      getChapterEvents: typeof getChapterEvents;
      getChapterRoles: typeof getChapterRoles;
      getChapterVenues: typeof getChapterVenues;
      interceptGQL: typeof interceptGQL;
      joinChapter: typeof joinChapter;
      leaveChapter: typeof leaveChapter;
      login: typeof login;
      logout: typeof logout;
      moveAttendeeToWaitlist: typeof moveAttendeeToWaitlist;
      register: typeof register;
      registerViaUI: typeof registerViaUI;
      toggleChapterSubscription: typeof toggleChapterSubscription;
      unbanUser: typeof unbanUser;
      updateSponsor: typeof updateSponsor;
      waitUntilMail: typeof waitUntilMail;
    }
  }
}
