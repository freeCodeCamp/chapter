import { Event, Venue } from '../../../../generated';

export interface IField {
  key: keyof IEventFormData;
  label: string;
  placeholder?: string;
  type: string;
  defaultValue?: string;
}

export const fields: IField[] = [
  {
    key: 'name',
    type: 'text',
    label: 'Event title',
    placeholder: 'Foo and the Bars',
  },
  {
    key: 'description',
    type: 'text',
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

export interface IEventFormData {
  name: string;
  description: string;
  url?: string | null;
  video_url?: string | null;
  capacity: number;
  tags: string;
  start_at: string;
  ends_at: string;
  venueId: number;
}

export type IEventData = Pick<
  Event,
  keyof Omit<IEventFormData, 'venueId' | 'tags'> | 'id'
> & {
  venueId?: number;
  tags: { name: string }[];
  venue: Omit<Venue, 'created_at' | 'updated_at' | 'events'>;
};

export interface IEventFormProps {
  onSubmit: (data: IEventFormData) => void;
  loading: boolean;
  data?: IEventData;
  submitText: string;
}

export const formatValue = (field: IField, store?: IEventData): any => {
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
      return tags.map(tag => tag.name).join(', ');
    }
  }

  return store[key];
};
