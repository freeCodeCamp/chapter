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

export const randomEnum = <T>(anEnum: Record<number | string, T>): T => {
  const numericKeys = Object.keys(anEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n));
  const stringKeys = Object.keys(anEnum).filter((s) => Number.isNaN(Number(s)));

  if (numericKeys.length && stringKeys.length !== numericKeys.length)
    throw new Error(
      `This enum appears to be heterogeneous, if you're sure you need one, you should probably
create a randomHeterogeneousEnum function`,
    );
  const randomIndex = Math.floor(Math.random() * stringKeys.length);
  // String enums cannot have numeric keys, so if numeric keys exist, we can
  // assume it is a numeric enum.
  const keys = numericKeys.length ? numericKeys : stringKeys;

  return anEnum[keys[randomIndex]];
};

export function shuffle<T>(xs: T[]): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
}
