const sanitizeTags = (tags: string): string[] => {
  if (tags) {
    return tags.split(',').map((item: string) =>
      item
        .split(' ')
        .filter((item) => item.length > 0)
        .join(''),
    );
  }

  return [];
};

export default sanitizeTags;
