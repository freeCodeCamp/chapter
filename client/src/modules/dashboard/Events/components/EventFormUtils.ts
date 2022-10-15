import {
  Event,
  SponsorsQuery,
  Venue,
  VenueType,
} from '../../../../generated/graphql';

import { isOnline, isPhysical } from '../../../../util/venueType';

export interface EventSponsorInput {
  id: number;
  type: string;
}

export interface EventFormData {
  name: string;
  description: string;
  url?: string | null;
  image_url: string;
  streaming_url?: string | null;
  capacity: number;
  start_at: Date;
  ends_at: Date;
  venue_type: VenueType;
  venue_id?: number | null;
  invite_only?: boolean;
  sponsors: Array<EventSponsorInput>;
  canceled: boolean;
  chapter_id: number;
}

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
    isRequired: false,
  },
  {
    key: 'image_url',
    type: 'text',
    label: 'Event Image Url',
    placeholder: 'https://www.example.image/url',
    isRequired: false,
  },
  {
    key: 'url',
    type: 'url',
    label: 'Url',
    placeholder: 'https://www.example.com',
    isRequired: false,
  },
  {
    key: 'capacity',
    type: 'number',
    label: 'Capacity',
    placeholder: '50',
    isRequired: true,
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

export type IEventData = Pick<
  Event,
  keyof Omit<EventFormData, 'venue_id' | 'sponsors' | 'chapter_id'> | 'id'
> & {
  venue_id?: number;
  venue?: Omit<Venue, 'events' | 'chapter_id' | 'chapter'> | null;
  sponsors: EventSponsorInput[];
};

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  loading: boolean;
  data?: IEventData;
  submitText: string;
  chapterId: number;
  loadingText: string;
}

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

export const getAllowedSponsors = (
  sponsorData: SponsorsQuery,
  watchSponsorsArray: EventSponsorInput[],
  sponsorFieldId?: number,
) =>
  sponsorData.sponsors.filter(
    (sponsor) =>
      !isSponsorSelectedElsewhere(sponsor, watchSponsorsArray, sponsorFieldId),
  );

export const parseEventData = (data: EventFormData) => {
  // It's ugly, but we can't rely on TS to check that chapter_id is absent, so
  // we have to remove it in case it's present:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chapter_id, sponsors, ...rest } = data;
  const sponsorArray = sponsors.map((s) => parseInt(String(s.id)));
  // Both url and streaming_url are optional. However, null will be accepted,
  // while empty strings will be rejected.
  const url = data.url?.trim() || null;
  const streaming_url = data.streaming_url?.trim() || null;

  return {
    ...rest,
    capacity: parseInt(String(data.capacity)),
    start_at: data.start_at,
    ends_at: data.ends_at,
    url,
    venue_id: isPhysical(data.venue_type)
      ? parseInt(String(data.venue_id))
      : null,
    streaming_url: isOnline(data.venue_type) ? streaming_url : null,
    sponsor_ids: sponsorArray,
  };
};
