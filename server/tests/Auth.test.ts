import assert from 'assert';
//import chai, { expect } from 'chai';
import chai from 'chai';
import { stub, restore } from 'sinon';
import sinonChai from 'sinon-chai';
//import { authTokenService } from 'src/services/AuthToken';

chai.use(sinonChai);

beforeEach(() => {
  stub(console, 'warn');
});

afterEach(() => {
  // Restore the default sandbox here
  restore();
});

// Setup

describe('First test', () => {
  it('Should fail test', () => {
    const tokenNum = '123456789';
    assert.equal(tokenNum, 'abc');
  });
});
