export default class Utilities {
  public static allValuesAreDefined(values: Array<any>): boolean {
    return !values.filter((val: any) => !val && val !== 0).length;
  }
}

export const randomEnum = <T>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = anEnum[randomIndex];
  return randomEnumValue;
};
