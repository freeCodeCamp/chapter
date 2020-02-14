const sanitezeTags = tags =>
  tags.split(',').map((item: string) =>
    item
      .split(' ')
      .filter(item => item.length > 0)
      .join(''),
  );

export default sanitezeTags;
