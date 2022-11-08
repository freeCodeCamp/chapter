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

export const redactSecrets = (input: any): any => {
  const secrets = ['Authorization', 'access_token', 'refresh_token', 'email'];
  const object = input instanceof Error ? errorToObject(input) : input;
  return cloneDeepWith((_value, key: string) => {
    if (key && secrets.includes(key)) return '***';
  }, object);
};
