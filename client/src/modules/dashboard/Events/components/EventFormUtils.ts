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
  attend_event?: boolean;
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
    label: 'Event Title',
    placeholder: 'Please put a descriptive title',
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
    key: 'capacity',
    type: 'number',
    label: 'Capacity',
    isRequired: true,
  },
];

export type IEventData = Pick<
  Event,
  | keyof Omit<
      EventFormData,
      'venue_id' | 'sponsors' | 'chapter_id' | 'attend_event'
    >
  | 'id'
> & {
  venue_id?: number;
  venue?: Omit<Venue, 'events' | 'chapter_id' | 'chapter'> | null;
  sponsors: EventSponsorInput[];
};

export interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  data?: IEventData;
  submitText: string;
  chapterId: number;
  loadingText: string;
  formType: 'new' | 'edit';
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
  // It's ugly, but we can't rely on TS to check that properties are absent, so
  // we have to remove them to avoid sending them to the server.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chapter_id, attend_event, sponsors, ...rest } = data;
  const sponsorArray = sponsors.map((s) => parseInt(String(s.id)));
  // streaming_url is optional. However, null will be accepted,
  // while empty strings will be rejected.
  const streaming_url = data.streaming_url?.trim() || null;

  return {
    ...rest,
    capacity: parseInt(String(data.capacity)),
    start_at: data.start_at,
    ends_at: data.ends_at,
    venue_id: isPhysical(data.venue_type)
      ? parseInt(String(data.venue_id))
      : null,
    streaming_url: isOnline(data.venue_type) ? streaming_url : null,
    sponsor_ids: sponsorArray,
  };
};
