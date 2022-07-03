import jwt from 'jsonwebtoken';

import { getConfig } from '../src/config';
import { authTokenService } from '../src/services/AuthToken';

// Setup
const secret = getConfig('JWT_SECRET');
const email = 'joe.smith@example.com';
const { token, code } = authTokenService.generateToken(email);

const getExpTime = (token: string): number => {
  const { exp } = jwt.decode(token) as {
    exp: number;
  };
  return exp;
};

const nowInSeconds = Date.now() / 1000;
const expTimeInSeconds = getExpTime(token);
const ninetyMinsInSeconds = 90 * 60;

// Tests
describe('AuthToken Setup', () => {
  it('Secret should be 32 or more characters', () => {
    expect(secret.length).toBeGreaterThan(31);
  });
});

describe('Generation of Code and Token', () => {
  it('The token and code should not be null', () => {
    expect(token).not.toBeNull();
    expect(code).not.toBeNull();
  });

  it('The code should have a length of 8 numbers', () => {
    expect(code.length).toBe(8);
  });

  it('The token should not have expired yet', () => {
    expect(nowInSeconds).toBeLessThan(expTimeInSeconds);
    expect(expTimeInSeconds).toBeGreaterThan(
      nowInSeconds + ninetyMinsInSeconds,
    );
  });
});
