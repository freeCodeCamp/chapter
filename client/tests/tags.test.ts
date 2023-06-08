import { parseTags } from '../src/util/tags';

describe('tags', () => {
  describe('parseTags', () => {
    it.each([
      { string: '', expected: [], description: 'empty string' },
      {
        string: 'Tag',
        expected: ['Tag'],
        description: 'single tag',
      },
      {
        string: 'Tag, Test',
        expected: ['Tag', 'Test'],
        description: 'simple case',
      },
      {
        string: '    Tag    , Test     ',
        expected: ['Tag', 'Test'],
        description: 'string with lots of empty space',
      },
      {
        string: 'Tag, Another tag, Test',
        expected: ['Tag', 'Another tag', 'Test'],
        description: 'string with two-word tag',
      },
    ])(
      'should return array with expected tags for $description',
      ({ string, expected }) => {
        expect(parseTags(string)).toStrictEqual(expected);
      },
    );
  });
});
