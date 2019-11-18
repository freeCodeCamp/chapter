// export interface IAddSponsorProps {}

export enum SponsorType {
  FOOD,
  BEVERAGE,
  OTHER,
}
export interface ISponsorData {
  name: string;
  website: string;
  type: SponsorType;
}
