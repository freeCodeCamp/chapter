import { Event, Venue } from '../../../../generated/graphql';

export interface Field {
  key: keyof EventFormData;
  label: string;
  placeholder?: string;
  type: string;
  defaultValue?: string;
}

export const fields: Field[] = [
  {
    key: 'name',
    type: 'text',
    label: 'Event title',
    placeholder: 'Foo and the Bars',
  },
  {
    key: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: '',
  },
  {
    key: 'url',
    type: 'text',
    label: 'Url',
    placeholder: '',
  },
  {
    key: 'video_url',
    type: 'text',
    label: 'Video Url',
    placeholder: '',
  },
  {
    key: 'capacity',
    type: 'number',
    label: 'Capacity',
    placeholder: '50',
  },
  {
    key: 'tags',
    type: 'text',
    label: 'Tags (separated by a comma)',
    placeholder: 'Foo, bar',
  },
  {
    key: 'start_at',
    type: 'datetime-local',
    label: 'Start at',
    defaultValue: new Date().toISOString().slice(0, 16),
  },
  {
    key: 'ends_at',
    type: 'datetime-local',
    label: 'End at',
    defaultValue: new Date(Date.now() + 1000 * 60 * 60)
      .toISOString()
      .slice(0, 16),
  },
];

export interface EventFormData {
  name: string;
  description: string;
  url?: string | null;
  video_url?: string | null;
  capacity: number;
  tags: string;
  start_at: string;
  ends_at: string;
  venueId?: number | null;
}

export type IEventData = Pick<
  Event,
  keyof Omit<EventFormData, 'venueId' | 'tags'> | 'id'
> & {
  venueId?: number;
  tags: { name: string }[];
  venue?: Omit<Venue, 'created_at' | 'updated_at' | 'events'> | null;
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
