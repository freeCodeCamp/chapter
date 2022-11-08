import { cloneDeepWith } from 'lodash/fp';

export const redactSecrets = (obj: any): any => {
  const secrets = ['Authorization', 'access_token', 'refresh_token'];
  return cloneDeepWith((_value, key: string) => {
    if (key && secrets.includes(key)) return '***';
  }, obj);
};
