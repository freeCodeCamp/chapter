export interface IAddSponsorProps {
  eventId: string;
  chapterId: string;
}

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
