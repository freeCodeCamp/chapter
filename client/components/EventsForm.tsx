import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl, TextField, Button, makeStyles } from '@material-ui/core';

interface IField {
  key: string;
  label: string;
  placeholder?: string;
  type: string;
  defaultValue?: string;
}

const fields: IField[] = [
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
    key: 'end_at',
    type: 'datetime-local',
    label: 'End at',
    defaultValue: new Date(Date.now() + 1000 * 60 * 60)
      .toISOString()
      .slice(0, 16),
  },
];

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '25%',
  },
  item: {
    marginTop: '20px',
  },
}));

export interface IEventFormData {
  name: string;
  description: string;
  capacity: number;
  tags: string;
}

interface IEventsFormProps {
  onSubmit: (data: IEventFormData) => void;
}

const EventsForm: React.FC<IEventsFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm();
  const styles = useStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map(field => (
        <FormControl className={styles.item} key={field.key}>
          <Controller
            control={control}
            as={
              <TextField
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
              />
            }
            name={field.key}
            defaultValue={field.defaultValue}
            options={{ required: true }}
          />
        </FormControl>
      ))}
      <Button
        className={styles.item}
        variant="contained"
        color="primary"
        type="submit"
      >
        Add Event
      </Button>
    </form>
  );
};

export default EventsForm;
