import {
  Event,
  EventTag,
  SponsorsQuery,
  Venue,
  VenueType,
} from '../../../../generated/graphql';

export interface Field {
  key: keyof EventFormData;
  label: string;
  placeholder?: string;
  type: string;
  isRequired: boolean;
}

export interface EventSponsorTypeInput {
  name: string;
  type: string;
}

export const sponsorTypes: EventSponsorTypeInput[] = [
  {
    name: 'Food',
    type: 'FOOD',
  },
  {
    name: 'Venue',
    type: 'VENUE',
  },
  {
    name: 'Other',
    type: 'OTHER',
  },
];

export interface VenueTypeInput {
  name: string;
  value: VenueType;
}

export const venueTypes: VenueTypeInput[] = [
  {
    name: 'In-person',
    value: VenueType.Physical,
  },
  {
    name: 'Online',
    value: VenueType.Online,
  },
  {
    name: 'In-person & Online',
    value: VenueType.PhysicalAndOnline,
  },
];

export interface EventSponsorInput {
  id: number;
  type: string;
}
export const fields: Field[] = [
  {
    key: 'name',
    type: 'text',
    label: 'Event title',
    placeholder: 'Foo and the Bars',
    isRequired: true,
  },
  {
    key: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: '',
    isRequired: true,
  },
  {
    key: 'image_url',
    type: 'text',
    label: 'Event Image Url',
    placeholder: 'https://www.example.image/url',
    isRequired: true,
  },
  {
    key: 'url',
    type: 'url',
    label: 'Url',
    placeholder: 'https://www.example.com',
    isRequired: true,
  },
  {
    key: 'capacity',
    type: 'number',
    label: 'Capacity',
    placeholder: '50',
    isRequired: true,
  },
  {
    key: 'tags',
    type: 'text',
    label: 'Tags (separated by a comma)',
    placeholder: 'Foo, bar',
    isRequired: false,
  },
  {
    key: 'start_at',
    type: 'datetime',
    label: 'Start at',
    isRequired: true,
  },
  {
    key: 'ends_at',
    type: 'datetime',
    label: 'End at',
    isRequired: true,
  },
];

export interface EventFormData {
  name: string;
  description: string;
  url?: string | null;
  image_url: string;
  streaming_url?: string | null;
  capacity: number;
  tags: string;
  start_at: Date;
  ends_at: Date;
  venue_type: VenueType;
  venue_id?: number | null;
  invite_only?: boolean;
  sponsors: Array<EventSponsorInput>;
  canceled: boolean;
}

export type IEventData = Pick<
  Event,
  keyof Omit<EventFormData, 'venue_id' | 'tags' | 'sponsors'> | 'id'
> & {
  venue_id?: number;
  tags: EventTag[];
  venue?: Omit<Venue, 'events' | 'chapter_id' | 'chapter'> | null;
  sponsors: EventSponsorInput[];
};

export interface EventFormProps {
  onSubmit: (data: EventFormData, chapterId: number) => void;
  loading: boolean;
  data?: IEventData;
  submitText: string;
  chapterId: number;
}

export const getAllowedSponsorTypes = (
  sponsorData: SponsorsQuery,
  sponsorTypes: EventSponsorTypeInput[],
  watchSponsorsArray: EventSponsorInput[],
  sponsorFieldId: number,
) =>
  sponsorTypes.filter(
    ({ type }) =>
      getAllowedSponsorsForType(
        sponsorData,
        type,
        watchSponsorsArray,
        sponsorFieldId,
      ).length,
  );

export const getAllowedSponsorsForType = (
  sponsorData: SponsorsQuery,
  sponsorType: string,
  watchSponsorsArray: EventSponsorInput[],
  sponsorFieldId?: number,
) =>
  sponsorData.sponsors.filter(
    (sponsor) =>
      sponsor.type === sponsorType &&
      !isSponsorSelectedElsewhere(sponsor, watchSponsorsArray, sponsorFieldId),
  );

export const getAllowedSponsors = (
  sponsorData: SponsorsQuery,
  watchSponsorsArray: EventSponsorInput[],
  sponsorFieldId?: number,
) =>
  sponsorData.sponsors.filter(
    (sponsor) =>
      !isSponsorSelectedElsewhere(sponsor, watchSponsorsArray, sponsorFieldId),
  );

const getSelectedFieldIdForSponsor = (
  sponsor: EventSponsorInput,
  watchSponsorsArray: EventSponsorInput[],
) =>
  watchSponsorsArray.findIndex(
    (selectedSponsor) => selectedSponsor.id === sponsor.id,
  );

const isSponsorSelectedElsewhere = (
  sponsor: EventSponsorInput,
  watchSponsorsArray: EventSponsorInput[],
  sponsorFieldId?: number,
) => {
  const selectedFieldId = getSelectedFieldIdForSponsor(
    sponsor,
    watchSponsorsArray,
  );
  return (
    selectedFieldId !== -1 &&
    (sponsorFieldId === undefined || selectedFieldId !== sponsorFieldId)
  );
};
