import { Button, Container, HStack } from '@chakra-ui/react';
import { InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import React from 'react';
import { useForm } from 'react-hook-form';

import { fieldTypeToComponent } from '../../../util/form';
import { Form } from '../../../../components/Form/Form';
import {
  DashboardChapterQuery,
  CreateChapterInputs,
  useCalendarIntegrationStatusQuery,
} from '../../../../generated/graphql';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import { DeleteChapterButton } from './DeleteChapterButton';

interface ChapterFormProps {
  onSubmit: (data: CreateChapterInputs) => Promise<void>;
  data?: DashboardChapterQuery;
  submitText: string;
  loadingText: string;
}

type Fields = {
  key: keyof CreateChapterInputs;
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
    key: 'banner_url',
    label: 'Banner Url',
    placeholder: 'https://www.freecodecamp.org',
    required: false,
    type: 'url',
  },
  {
    key: 'logo_url',
    label: 'Logo Url',
    placeholder: 'https://www.freecodecamplogo.org',
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
  const { onSubmit, data, submitText, loadingText } = props;
  const chapter = data?.dashboardChapter;

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery({ skip: !!chapter });

  const defaultValues: CreateChapterInputs = {
    name: chapter?.name ?? '',
    description: chapter?.description ?? '',
    city: chapter?.city ?? '',
    region: chapter?.region ?? '',
    country: chapter?.country ?? '',
    category: chapter?.category ?? '',
    logo_url: chapter?.logo_url ?? '',
    banner_url: chapter?.banner_url ?? '',
    chat_url: chapter?.chat_url ?? '',
  };
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<CreateChapterInputs>({
    defaultValues,
  });

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<CreateChapterInputs>({
      onSubmit,
    });

  const isAuthenticated = dataStatus?.calendarIntegrationStatus;
  const isBroken = isAuthenticated === null;

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
      {fields.map(({ key, label, placeholder, required, type }) => {
        const Component = fieldTypeToComponent(type);
        return (
          <Component
            key={key}
            type={type}
            label={label}
            isDisabled={loading}
            isRequired={required}
            placeholder={placeholder}
            defaultValue={defaultValues[key] ?? undefined}
            {...register(key)}
          />
        );
      })}
      {!loadingStatus && dataStatus && (
        <Container>
          {isAuthenticated ? (
            <>
              <InfoIcon boxSize={5} marginRight={1} />
              Chapter is authenticated with calendar api, it will attempt
              creating calendar for chapter.
            </>
          ) : isBroken ? (
            <>
              <WarningTwoIcon boxSize={5} marginRight={1} />
              Calendar integration is not working. Calendar will not be created
              for chapter.
            </>
          ) : (
            <>
              <InfoIcon boxSize={5} marginRight={1} />
              Chapter is not authenticated with calendar api, it will not create
              calendar for chapter.
            </>
          )}
        </Container>
      )}
      <HStack gap="1em" width="100%">
        <Button
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
        {chapter?.id && (
          <DeleteChapterButton width="100%" chapterId={chapter.id} />
        )}
      </HStack>
    </Form>
  );
};

export default ChapterForm;
