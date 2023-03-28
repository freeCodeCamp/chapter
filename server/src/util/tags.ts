const getUniqueTags = (tags: string[]) => [
  ...new Set(tags.map((tagName) => tagName.trim()).filter(Boolean)),
];

export const createTagsData = (tags: string[]) => ({
  create: getUniqueTags(tags).map((name) => ({
    tag: { connectOrCreate: { create: { name }, where: { name } } },
  })),
});
