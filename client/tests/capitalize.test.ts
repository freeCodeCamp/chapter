import { capitalize } from '../src/util/capitalize';

describe('capitalize', () => {
  it('should capitalize a string', () => {
    expect(capitalize('hello world')).toBe('Hello world');
    expect(capitalize('heLlo woRld')).toBe('Hello world');
    expect(capitalize('a')).toBe('A');
    expect(capitalize('A')).toBe('A');
    expect(capitalize('')).toBe('');
  });
  it('should return an empty string if no string is passed', () => {
    expect(capitalize()).toBe('');
  });
});
