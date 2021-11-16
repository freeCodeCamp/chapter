import { Event, Venue } from '../../../../generated/graphql';

export interface Field {
  key: keyof EventFormData;
  label: string;
  placeholder?: string;
  type: string;
  defaultValue?: string;
  isRequired: boolean;
}

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
    placeholder: '',
    isRequired: true,
  },
  {
    key: 'streaming_url',
    type: 'url',
    label: 'Streaming Url',
    placeholder: '',
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
    type: 'datetime-local',
    label: 'Start at',
    defaultValue: new Date().toISOString().slice(0, 16),
    isRequired: true,
  },
  {
    key: 'ends_at',
    type: 'datetime-local',
    label: 'End at',
    defaultValue: new Date(Date.now() + 1000 * 60 * 60)
      .toISOString()
      .slice(0, 16),
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
  start_at: string;
  ends_at: string;
  venue_id?: number | null;
  invite_only?: boolean;
  sponsors: Array<EventSponsorInput>;
}

export type IEventData = Pick<
  Event,
  keyof Omit<EventFormData, 'venue_id' | 'tags' | 'sponsors'> | 'id'
> & {
  venue_id?: number;
  tags: { name: string }[];
  venue?: Omit<Venue, 'events'> | null;
  sponsors: EventSponsorInput[];
};

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  loading: boolean;
  data?: IEventData;
  submitText: string;
}

export const formatValue = (field: Field, store?: IEventData): any => {
  const { key } = field;

  if (!store || !Object.keys(store).includes(key)) {
    return field.defaultValue;
  }

  if (key.endsWith('_at')) {
    return new Date(store[field.key]).toISOString().slice(0, 16);
  }

  if (key === 'tags') {
    const tags = store[key];
    if (tags) {
      return tags.map((tag) => tag.name).join(', ');
    }
  }

  return store[key];
};
