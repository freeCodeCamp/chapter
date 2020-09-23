import Utilities from '../util/Utilities';
import assert from 'assert';

describe('Utilities Class', () => {
  it('allValuesAreDefined should correctly catch undefined, null, and empty string values', () => {
    const passingSet1 = ['test', 1, 0];
    const passingSet2 = ['test', 1, {}];
    const passingSet3 = ['test', 1, 239];

    const failingSet1 = ['', 'test', 234];
    const failingSet2 = [undefined, 'testString', 70];
    const failingSet3 = [null, 'test123', 2342];

    assert.strictEqual(Utilities.allValuesAreDefined(passingSet1), true);
    assert.strictEqual(Utilities.allValuesAreDefined(passingSet2), true);
    assert.strictEqual(Utilities.allValuesAreDefined(passingSet3), true);
    assert.strictEqual(Utilities.allValuesAreDefined(failingSet1), false);
    assert.strictEqual(Utilities.allValuesAreDefined(failingSet2), false);
    assert.strictEqual(Utilities.allValuesAreDefined(failingSet3), false);
  });
});
