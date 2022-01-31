import { assert, expect } from 'chai';
import jwt from 'jsonwebtoken';
import { stub, restore } from 'sinon';

import { getConfig } from '../src/config';
import { authTokenService } from '../src/services/AuthToken';

beforeEach(() => {
  stub(console, 'warn');
});

afterEach(() => {
  // Restore the default sandbox here
  restore();
});

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
    expect(secret).to.have.lengthOf.above(31);
  });
});

describe('Generation of Code and Token', () => {
  it('The token and code should not be null', () => {
    assert.notEqual(token, null);
    assert.notEqual(code, null);
  });

  it('The code should have a length of 8 numbers', () => {
    expect(code).to.have.lengthOf(8);
  });

  it('The token should not have expired yet', () => {
    expect(nowInSeconds).to.be.below(expTimeInSeconds);
    expect(expTimeInSeconds).to.be.above(nowInSeconds + ninetyMinsInSeconds);
  });
});
