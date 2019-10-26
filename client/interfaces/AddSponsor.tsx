export interface IAddSponsorProps {
  eventId: string;
  chapterId: string;
}

export interface ISponsorData {
  name: string;
  website: string;
  type: 'FOOD' | 'BEVERAGE' | 'OTHER'; // TODO: Add VENUE
}
