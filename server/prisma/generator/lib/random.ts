export const random = (n: number) => Math.floor(Math.random() * n);

export const randomItem = <T>(arr: T[]): T => {
  return arr[random(arr.length)];
};

export const randomItems = <T>(arr: T[], n: number, uniq = true): T[] => {
  if (n > arr.length && uniq) {
    throw new Error(
      'Cant find more uniq items than there are items in the array',
    );
  }

  if (n === arr.length) {
    return arr;
  }

  const newArr = [...arr];
  const out: T[] = [];

  for (let i = 0; i < n; i++) {
    const randomIndex = random(newArr.length);
    out.push(newArr[randomIndex]);
    newArr.splice(randomIndex, 1);
  }

  return out;
};

export const randomEnum = <T>(anEnum: Record<number, T>): T => {
  const enumNumericKeys = Object.keys(anEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n));
  const randomIndex = Math.floor(Math.random() * enumNumericKeys.length);
  return anEnum[randomIndex];
};
