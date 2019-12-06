export default class Utilities {
  public static allValuesAreDefined(values: Array<any>): boolean {
    return !values.filter((val: any) => !val && val !== 0).length;
  }
}
