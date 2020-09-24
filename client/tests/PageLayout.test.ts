import SomethingObject from '../src/components';
import assert from 'assert';
import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
//import Utilities from 'server/util/Utilities';

chai.use(sinonChai);

beforeEach(() => {
  sinon.spy(console, 'warn');
});

afterEach(() => {
  // Restore the default sandbox here
  sinon.restore();
});

// Setup
/*const something1 = [
  emailAddresses,
  subject,
  htmlEmail,
  backupText,
];
const something2 = 'Welcome To Chapter!';
const something3 = '<div><h1>Hello Test</h1></div>';
const something4 = 'Email html failed to load';
*/

describe('PageLayout Class', () => {
  it('Should do something', () => {
    //const something_else = new SomethingObject(
    //  emailAddresses,
    //  subject,
    //  htmlEmail,
    //  backupText,
    //);

    //const { monkey } = something_else.transporter.options as any;
    fail('New client test for PageLayout');
  });
});
