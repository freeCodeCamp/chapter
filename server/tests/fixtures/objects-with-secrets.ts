// This is based off of a real response from Google. The idea is that it's a
// complicated and somewhat realistic object, so provides a robust test.
export const fullResponse = {
  access_token: 'someaccesstoken', // Google doesn't put these here, it's just here to make the test harder to pass
  response: {
    config: {
      url: 'https://www.googleapis.com/calendar/v3/calendars/testing/events/aneventid?sendUpdates=all',
      method: 'PUT',
      userAgentDirectives: [
        {
          product: 'google-api-nodejs-client',
          version: '5.1.0',
          comment: 'gzip',
        },
      ],
      paramsSerializer: [],
      data: {
        start: { dateTime: '2022-11-10T11:10:54.000Z' },
        end: { dateTime: '2022-11-11T11:40:54.000Z' },
        summary: 'calendar testing EVENT',
        attendees: [{ email: 'test2@user.org' }],
        guestsCanSeeOtherGuests: false,
        guestsCanInviteOthers: false,
        refresh_token: 'someaccesstoken', // Google doesn't put these here, it's just here to make the test harder to pass
      },
      headers: {
        'x-goog-api-client': 'gdcl/5.1.0 gl-node/16.18.0 auth/7.14.1',
        'Accept-Encoding': 'gzip',
        'User-Agent': 'google-api-nodejs-client/5.1.0 (gzip)',
        Authorization: 'Bearer someaccesstoken',
        'Content-Type': 'application/json',
        TEST: { access_token: '123', something: 'else' },
        Accept: 'application/json',
      },
      params: { sendUpdates: 'all' },
      validateStatus: [],
      retry: true,
      body: '{"start":{"dateTime":"2022-11-10T11:10:54.000Z"},"end":{"dateTime":"2022-11-11T11:40:54.000Z"},"summary":"calendar testing EVENT","attendees":[],"guestsCanSeeOtherGuests":false,"guestsCanInviteOthers":false}',
      responseType: 'json',
      retryConfig: {
        currentRetryAttempt: 0,
        retry: 3,
        httpMethodsToRetry: ['GET', 'HEAD', 'PUT', 'OPTIONS', 'DELETE'],
        noResponseRetries: 2,
        statusCodesToRetry: [
          [100, 199],
          [429, 429],
          [500, 599],
        ],
      },
    },
    data: {
      error: {
        errors: [
          {
            domain: 'global',
            reason: 'notFound',
            message: 'Not Found',
          },
        ],
        code: 404,
        message: 'Not Found',
      },
    },
    headers: {
      'alt-svc':
        'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      connection: 'close',
      'content-encoding': 'gzip',
      'content-type': 'application/json; charset=UTF-8',
      date: 'Mon, 07 Nov 2022 11:16:47 GMT',
      expires: 'Mon, 01 Jan 1990 00:00:00 GMT',
      pragma: 'no-cache',
      server: 'ESF',
      'transfer-encoding': 'chunked',
      vary: 'Origin, X-Origin, Referer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '0',
    },
    status: 404,
    statusText: 'Not Found',
    request: {
      responseURL:
        'https://www.googleapis.com/calendar/v3/calendars/testing/events/aneventid?sendUpdates=all',
    },
  },
  config: {
    url: 'https://www.googleapis.com/calendar/v3/calendars/testing/events/aneventid?sendUpdates=all',
    method: 'PUT',
    userAgentDirectives: [
      {
        product: 'google-api-nodejs-client',
        version: '5.1.0',
        comment: 'gzip',
      },
    ],
    paramsSerializer: [],
    data: {
      start: { dateTime: '2022-11-10T11:10:54.000Z' },
      end: { dateTime: '2022-11-11T11:40:54.000Z' },
      summary: 'calendar testing EVENT',
      attendees: [],
      guestsCanSeeOtherGuests: false,
      guestsCanInviteOthers: false,
    },
    headers: {
      'x-goog-api-client': 'gdcl/5.1.0 gl-node/16.18.0 auth/7.14.1',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'google-api-nodejs-client/5.1.0 (gzip)',
      Authorization: 'Bearer someaccesstoken',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: { sendUpdates: 'all' },
    validateStatus: [],
    retry: true,
    body: '{"start":{"dateTime":"2022-11-10T11:10:54.000Z"},"end":{"dateTime":"2022-11-11T11:40:54.000Z"},"summary":"calendar testing EVENT","attendees":[],"guestsCanSeeOtherGuests":false,"guestsCanInviteOthers":false}',
    responseType: 'json',
    retryConfig: {
      currentRetryAttempt: 0,
      retry: 3,
      httpMethodsToRetry: ['GET', 'HEAD', 'PUT', 'OPTIONS', 'DELETE'],
      noResponseRetries: 2,
      statusCodesToRetry: [
        [100, 199],
        [429, 429],
        [500, 599],
      ],
    },
  },
  code: 404,
  errors: [{ domain: 'global', reason: 'notFound', message: 'Not Found' }],
};

export const invalidGrant = {
  stack: 'Error: invalid_grant\n',
  message: 'invalid_grant',
  response: {
    config: {
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
      data: 'refresh_token=someaccesstoken&client_id=123-456id.apps.googleusercontent.com&client_secret=someaccesstoken&grant_type=refresh_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'google-api-nodejs-client/7.14.1',
        'x-goog-api-client': 'gl-node/16.18.0 auth/7.14.1',
        Accept: 'application/json',
      },
      paramsSerializer: [],
      body: 'refresh_token=someaccesstoken&client_id=123-456id.apps.googleusercontent.com&client_secret=someaccesstoken&grant_type=refresh_token',
      validateStatus: [],
      responseType: 'json',
    },
    data: { error: 'invalid_grant', error_description: 'Bad Request' },
    headers: {
      'alt-svc':
        'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      connection: 'close',
      'content-encoding': 'gzip',
      'content-type': 'application/json; charset=utf-8',
      date: 'Fri, 11 Nov 2022 10:14:49 GMT',
      expires: 'Mon, 01 Jan 1990 00:00:00 GMT',
      pragma: 'no-cache',
      server: 'scaffolding on HTTPServer2',
      'transfer-encoding': 'chunked',
      vary: 'Origin, X-Origin, Referer',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'x-xss-protection': '0',
    },
    status: 400,
    statusText: 'Bad Request',
    request: { responseURL: 'https://oauth2.googleapis.com/token' },
  },
  config: {
    method: 'POST',
    url: 'https://oauth2.googleapis.com/token',
    data: 'refresh_token=someaccesstoken&client_id=123-456id.apps.googleusercontent.com&client_secret=someaccesstoken&grant_type=refresh_token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'google-api-nodejs-client/7.14.1',
      'x-goog-api-client': 'gl-node/16.18.0 auth/7.14.1',
      Accept: 'application/json',
    },
    paramsSerializer: [],
    body: 'refresh_token=someaccesstoken&client_id=123-456id.apps.googleusercontent.com&client_secret=someaccesstoken&grant_type=refresh_token',
    validateStatus: [],
    responseType: 'json',
  },
  code: '400',
};

export const circularObject: Record<string, unknown> = {};
circularObject.circularRef = circularObject;

export const circularObjectWithSecret: Record<string, unknown> = {
  ['access_token']: '123',
};
circularObjectWithSecret.circularRef = circularObjectWithSecret;

export const redactedCircularObjectWithSecret: Record<string, unknown> = {
  ['access_token']: '***',
};
redactedCircularObjectWithSecret.circularRef = redactedCircularObjectWithSecret;

export const nestedObject = {
  something: 'else',
  Authorization: 'Bearer 1234567890',
  foo: {
    bar: 'bat',
    access_token: '1234567890',
  },
};
export const redactedNestedObject = {
  something: 'else',
  Authorization: '***',
  foo: {
    bar: 'bat',
    access_token: '***',
  },
};
