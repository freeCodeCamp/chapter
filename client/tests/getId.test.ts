import { getId } from '../src/util/getId';

describe('getId', () => {
  it('returns correct id for query including id', () => {
    const query = { id: '10', notId: '15' };
    expect(getId(query)).toBe(10);
  });
  it('returns first number when query.id is an array', () => {
    const query = { id: ['15', '10'] };
    expect(getId(query)).toBe(15);
  });
  it('returns 1 as default when id is not present in query', () => {
    const query = { notId: '15' };
    expect(getId(query)).toBe(1);
  });
  it.each([
    ['10,10', 10],
    ['14.2', 14],
  ])('parses id parameter to Integer #%#', (id, expected) => {
    const query = { id: id };
    expect(getId(query)).toBe(expected);
  });
  it('returns NaN when query.id cannot be parsed to Integer', () => {
    const query = { id: 'a' };
    expect(getId(query)).toBe(NaN);
  });
});
