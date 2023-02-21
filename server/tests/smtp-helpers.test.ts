import assert from 'assert';

import { allValuesAreDefined } from '../src/services/mail-providers/smtp-helpers';

describe('allValuesAreDefined', () => {
  it('it should correctly catch undefined, null, and empty string values', () => {
    const pass1 = ['test', 1, 0];
    const pass2 = ['test', 1, {}];
    const pass3 = ['test', 1, 239];

    const fail1 = ['', 'test', 234];
    const fail2 = [undefined, 'testString', 70];
    const fail3 = [null, 'test123', 2342];
    const fail4 = [undefined, undefined, undefined];

    assert.equal(allValuesAreDefined(pass1), true);
    assert.equal(allValuesAreDefined(pass2), true);
    assert.equal(allValuesAreDefined(pass3), true);
    assert.equal(allValuesAreDefined(fail1), false);
    assert.equal(allValuesAreDefined(fail2), false);
    assert.equal(allValuesAreDefined(fail3), false);
    assert.equal(allValuesAreDefined(fail4), false);
  });
});
