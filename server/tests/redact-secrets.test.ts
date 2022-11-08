// import { GaxiosError } from 'gaxios';
import { redactSecrets } from '../src/util/redact-secrets';

import {
  circularObject,
  circularObjectWithSecret,
  fullResponse,
  redactedCircularObjectWithSecret,
  nestedObject,
  redactedNestedObject,
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
