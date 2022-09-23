import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/Form/Input';
import { TextArea } from '../../../../components/Form/TextArea';
import type { Chapter, ChapterQuery } from '../../../../generated/graphql';
import styles from '../../../../styles/Form.module.css';

export type ChapterFormData = Omit<
  Chapter,
  'id' | 'events' | 'creator_id' | 'users' | 'banned_users'
>;

interface ChapterFormProps {
  loading: boolean;
  onSubmit: (data: ChapterFormData) => Promise<void>;
  data?: ChapterQuery;
  submitText: string;
  loadingText: string;
}

type Fields = {
  key: keyof ChapterFormData;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
};

const fields: Fields[] = [
  {
    key: 'name',
    label: 'Chapter name',
    placeholder: 'freeCodeCamp',
    required: true,
    type: 'text',
  },
  {
    key: 'description',
    label: 'Description',
    placeholder:
      'freeCodeCamp is a nonprofit organization that helps people learn to code for free',
    required: true,
    type: 'textarea',
  },
  {
    key: 'city',
    label: 'City',
    placeholder: 'San Francisco',
    required: false,
    type: 'text',
  },
  {
    key: 'region',
    label: 'Region',
    placeholder: 'California',
    required: false,
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'United States of America',
    required: false,
    type: 'text',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Education and nonprofit work',
    required: true,
    type: 'text',
  },
  {
    key: 'image_url',
    label: 'Image Url',
    placeholder: 'https://www.freecodecamp.org',
    required: false,
    type: 'url',
  },
  {
    key: 'chat_url',
    label: 'Chat link',
    placeholder: 'https://discord.gg/KVUmVXA',
    required: false,
    type: 'url',
  },
];

const ChapterForm: React.FC<ChapterFormProps> = (props) => {
  const { loading, onSubmit, data, submitText, loadingText } = props;
  const chapter = data?.chapter;

  const defaultValues: ChapterFormData = {
    name: chapter?.name ?? '',
    description: chapter?.description ?? '',
    city: chapter?.city ?? '',
    region: chapter?.region ?? '',
    country: chapter?.country ?? '',
    category: chapter?.category ?? '',
    image_url: chapter?.image_url ?? '',
    chat_url: chapter?.chat_url ?? '',
  };
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<ChapterFormData>({
    defaultValues,
  });

  return (
    <form
      aria-label={submitText}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <VStack>
        {fields.map(({ key, label, placeholder, required, type }) =>
          type == 'textarea' ? (
            <TextArea
              key={key}
              label={label}
              placeholder={placeholder}
              {...register(key)}
              isRequired={required}
              defaultValue={defaultValues[key] ?? undefined}
              isDisabled={loading}
            />
          ) : (
            <Input
              key={key}
              label={label}
              placeholder={placeholder}
              {...register(key)}
              type={type}
              isRequired={required}
              defaultValue={defaultValues[key] ?? undefined}
              isDisabled={loading}
            />
          ),
        )}
        <Button
          mt="6"
          width="100%"
          variant="solid"
          colorScheme="blue"
          type="submit"
          isDisabled={!isDirty || loading}
          isLoading={loading}
          loadingText={loadingText}
        >
          {submitText}
        </Button>
      </VStack>
    </form>
  );
};

export default ChapterForm;