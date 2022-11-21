// import { GaxiosError } from 'gaxios';
import { redactSecrets } from '../src/util/redact-secrets';

import {
  circularObject,
  circularObjectWithSecret,
  fullResponse,
  redactedCircularObjectWithSecret,
  nestedObject,
  redactedNestedObject,
  invalidGrant,
} from './fixtures/objects-with-secrets';

describe('redactSecrets', () => {
  it('returns the original object if no secrets are found', () => {
    const obj = { foo: { bar: 'bat' } };
    expect(redactSecrets(obj)).toEqual(obj);
  });

  it('redacts Authorization', () => {
    const obj = {
      something: 'else',
      Authorization: 'Bearer 1234567890',
    };

    expect(redactSecrets(obj)).toEqual({
      something: 'else',
      Authorization: '***',
    });
  });

  it('redacts access_token', () => {
    const obj = {
      access_token: '1234567890',
    };

    expect(redactSecrets(obj)).toEqual({
      access_token: '***',
    });
  });

  it('redacts refesh_token', () => {
    const obj = {
      refresh_token: '1234567890',
    };

    expect(redactSecrets(obj)).toEqual({
      refresh_token: '***',
    });
  });

  it('redacts email', () => {
    const obj = {
      email: 'test@user.org',
      attendees: [{ email: 'test2@user.org' }],
    };

    expect(redactSecrets(obj)).toEqual({
      email: '***',
      attendees: [{ email: '***' }],
    });
  });

  it('redacts session keys and signatures inside cookies', () => {
    const obj = {
      cookie:
        'fine=abc123; session=abc123; access_token=ghi789; session.sig=def456',
    };

    expect(redactSecrets(obj)).toEqual({
      cookie: 'fine=abc123; session=***; access_token=***; session.sig=***',
    });
  });

  it('redacts secrets encoded as url params', () => {
    const obj = {
      prop: 'refresh_token=1%2F%2Fabc123&client_id=123-456id.apps.googleusercontent.com&something_else=123&refresh_token=1%2F%2Fabc123&client_secret=1234567890&grant_type=refresh_token',
    };
    const expected = {
      prop: 'refresh_token=***&client_id=***&something_else=123&refresh_token=***&client_secret=***&grant_type=refresh_token',
    };

    expect(redactSecrets(obj)).toEqual(expected);
  });

  it('redacts secrets inside a JSON stringified body', () => {
    const obj = JSON.stringify({
      body: {
        refresh_token: '1//abc123',
        innocuous: 'value',
        attendees: [{ email: 'hide@me' }],
      },
    });

    const expected = JSON.stringify({
      body: {
        refresh_token: '***',
        innocuous: 'value',
        attendees: [{ email: '***' }],
      },
    });

    expect(redactSecrets(obj)).toEqual(expected);
  });

  it('redacts secrets in nested objects', () => {
    expect(redactSecrets(nestedObject)).toEqual(redactedNestedObject);
  });

  it('handles circular objects', () => {
    expect(redactSecrets(circularObject)).toEqual(circularObject);
  });

  it('handles circular objects with secrets', () => {
    expect(redactSecrets(circularObjectWithSecret)).toEqual(
      redactedCircularObjectWithSecret,
    );
  });

  it('handles a full response object', () => {
    expect(JSON.stringify(redactSecrets(fullResponse))).not.toMatch(
      'someaccesstoken',
    );
  });

  it('handles an invalid grant', () => {
    expect(JSON.stringify(redactSecrets(invalidGrant))).not.toMatch(
      'someaccesstoken',
    );
  });

  it('does not mutate the original object', () => {
    const obj = {
      nested: {
        Authorization: 'Bearer 1234567890',
      },
      access_token: '1234567890',
    };

    redactSecrets(obj);

    expect(obj).toEqual({
      nested: {
        Authorization: 'Bearer 1234567890',
      },
      access_token: '1234567890',
    });
  });

  it('can redact errors', () => {
    type SpecialError = Error & { secrets?: Record<string, unknown> };
    const anError: SpecialError = new Error('some error');
    anError.secrets = { access_token: '1234567890' };

    const errorObject = {
      secrets: { access_token: '***' },
      message: anError.message?.slice(),
      stack: anError.stack?.slice(),
    };

    expect(redactSecrets(anError)).toEqual(errorObject);
  });
});
