import { createTagsData } from '../src/util/tags';

const { arrayContaining } = expect;

describe('tags', () => {
  describe('createTagsData', () => {
    it.each([
      { tags: [], expected: [], description: 'empty array' },
      {
        tags: ['Tag', 'Test'],
        expected: arrayContaining([
          {
            tag: {
              connectOrCreate: {
                create: { name: 'Tag' },
                where: { name: 'Tag' },
              },
            },
          },
          {
            tag: {
              connectOrCreate: {
                create: { name: 'Test' },
                where: { name: 'Test' },
              },
            },
          },
        ]),
        description: 'array with unique tags',
      },
    ])('should return expected data for $description', ({ tags, expected }) => {
      expect(createTagsData(tags)).toEqual({ create: expected });
    });

    it('should return only unique tags for array with duplicated tags', () => {
      const result = createTagsData(['Test', 'Test', 'Test', 'Tag']);
      const unique = new Set([
        ...result.create.map(
          ({
            tag: {
              connectOrCreate: {
                create: { name },
              },
            },
          }) => name,
        ),
      ]);
      expect(result.create.length).toBe(2);
      expect(unique.size).toBe(2);
      expect(unique.has('Test')).toBe(true);
      expect(unique.has('Tag')).toBe(true);
    });
  });
});
