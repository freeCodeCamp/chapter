import { cloneDeepWith } from 'lodash/fp';

// It's not possible to directly clone an Error, so this function pulls out the
// properties (name, message, stack and so on) and builds a new object with
// them.
function errorToObject(err: Error) {
  const obj = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    // @ts-expect-error TS doesn't like the fact we're indexing into an Error,
    // even though it works
    obj[key] = err[key];
  });
  return obj;
}

const secrets = [
  'Authorization',
  'access_token',
  'refresh_token',
  'email',
  'client_secret',
  'client_id',
  'session',
  'session.sig',
];

function redactCookieString(str: string) {
  return secrets.reduce(
    (prev, secret) =>
      prev.replace(new RegExp(`${secret}=[^;]+`, 'g'), `${secret}=***`),
    str,
  );
}

function redactURLEncodedString(str: string) {
  return secrets.reduce(
    (prev, secret) =>
      prev.replace(new RegExp(`${secret}=[^&]+`, 'g'), `${secret}=***`),
    str,
  );
}

function redactJSONString(str: string) {
  return secrets.reduce(
    (prev, secret) =>
      prev.replace(new RegExp(`"${secret}":"[^"]+"`, 'g'), `"${secret}":"***"`),
    str,
  );
}

export const redactSecrets = (input: any): any => {
  const object = input instanceof Error ? errorToObject(input) : input;
  return cloneDeepWith((value, key: string) => {
    if (key && secrets.includes(key)) return '***';
    if ((key == 'Cookie' || key === 'cookie') && typeof value === 'string')
      return redactCookieString(value);
    if (typeof value === 'string')
      return redactJSONString(redactURLEncodedString(value));
  }, object);
};
