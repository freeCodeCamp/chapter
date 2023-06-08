import { Button, Container, HStack } from '@chakra-ui/react';
import { InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import React from 'react';
import { useForm } from 'react-hook-form';

import { fieldTypeToComponent } from '../../../util/form';
import { Form } from '../../../../components/Form/Form';
import { useCalendarIntegrationStatusQuery } from '../../../../generated/graphql';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import { DeleteChapterButton } from './DeleteChapterButton';
import {
  ChapterFormData,
  ChapterFormProps,
  fields,
  getDefaultValues,
  resolver,
} from './ChapterFormUtils';

const ChapterForm: React.FC<ChapterFormProps> = (props) => {
  const { onSubmit, data, submitText, loadingText } = props;
  const chapter = data?.dashboardChapter;

  const { loading: loadingStatus, data: dataStatus } =
    useCalendarIntegrationStatusQuery({ skip: !!chapter });

  const defaultValues: ChapterFormData = getDefaultValues(chapter);
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<ChapterFormData>({
    defaultValues,
    mode: 'all',
    resolver,
  });

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<ChapterFormData>({
      onSubmit,
    });

  const isAuthenticated = dataStatus?.calendarIntegrationStatus;
  const isBroken = isAuthenticated === null;

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
      {fields.map(({ key, label, placeholder, isRequired, type }) => {
        const Component = fieldTypeToComponent(type);
        const error = errors[key]?.message;
        return (
          <Component
            key={key}
            type={type}
            label={label}
            error={error}
            isDisabled={loading}
            isRequired={isRequired}
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
              Instance is authenticated with calendar api, it will attempt
              creating calendar for created chapter.
            </>
          ) : isBroken ? (
            <>
              <WarningTwoIcon boxSize={5} marginRight={1} />
              Calendar integration is not working. Calendar will not be created
              for chapter.
            </>
          ) : (
            <>
              <WarningTwoIcon boxSize={5} marginRight={1} />
              Instance is not authenticated with calendar api, it will not
              create calendar for chapter.
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
          isDisabled={!isDirty || loading || !isValid}
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
