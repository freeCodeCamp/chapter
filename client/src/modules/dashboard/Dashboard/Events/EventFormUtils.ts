import { IVenueModal } from 'client/store/types/venues';
import { IEventModal } from 'client/store/types/events';

export interface IField {
  key: string;
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
  capacity: number;
  tags: string;
  venue?: number;
}

export interface IEventFormProps {
  onSubmit: (data: IEventFormData) => void;
  loading: boolean;
  venues: IVenueModal[];
  venuesLoading: boolean;
  data?: IEventModal;
  submitText: string;
}
