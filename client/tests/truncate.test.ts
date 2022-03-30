import { truncate } from '../src/util/truncate';

const shortSentence = 'a short sentence';
const twoCharEnd = 'short word at the en';
const expectedTwoCharEnd = 'short word at...';
const oneCharEnd = 'oh no !';
const expectedOneCharEnd = 'oh...';
const longSentence =
  'quite a lot of words crammed together in a single sentence';

describe('truncate', () => {
  it('should truncate long enough sentences', () => {
    expect.assertions(1);
    expect(truncate(longSentence, 20)).not.toContain(longSentence);
  });
  it('should not truncate sentences that are short enough', () => {
    expect.assertions(2);
    const actual = truncate(shortSentence, 20);
    expect(actual).toContain(shortSentence);
    expect(actual).not.toContain('...');
  });
  it('should add an ellipsis when truncating', () => {
    expect.assertions(1);
    expect(truncate(longSentence, 20)).toContain('...');
  });
  it('should only truncate the minimum required to fit', () => {
    expect.assertions(4);

    const oneMaxLength = oneCharEnd.length - 1;
    const oneActual = truncate(oneCharEnd, oneMaxLength);

    expect(oneActual.length).toBeLessThanOrEqual(oneMaxLength);
    expect(oneActual).toEqual(expectedOneCharEnd);
    const twoMaxLength = twoCharEnd.length - 1;
    const twoActual = truncate(twoCharEnd, twoMaxLength);

    expect(twoActual.length).toBeLessThanOrEqual(twoMaxLength);
    expect(twoActual).toEqual(expectedTwoCharEnd);
  });

  it('should handle long words', () => {
    expect.assertions(1);

    expect(truncate('supercalifragilisticexpialidocious', 10)).toBe(
      'superca...',
    );
  });
});
