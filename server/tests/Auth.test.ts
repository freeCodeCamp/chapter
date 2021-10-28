import assert from 'assert';
import chai, { expect } from 'chai';
import { stub, restore } from 'sinon';
import sinonChai from 'sinon-chai';
import { authTokenService } from 'src/services/AuthToken';
import { getConfig } from 'src/config';
import jwt from 'jsonwebtoken';

chai.use(sinonChai);

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
const isTokenExpired = (token: string): number => {
  const { exp } = jwt.decode(token) as {
    exp: number;
  };
  return exp;
};

const now = Date.now() / 1000;

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
    expect(now).to.be.below(isTokenExpired(token));
  });
});
