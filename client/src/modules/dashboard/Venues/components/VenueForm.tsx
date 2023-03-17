import { Button, Heading } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Select } from '../../../../components/Form/Select';
import { Input } from '../../../../components/Form/Input';
import { Form } from '../../../../components/Form/Form';
import { useDisableWhileSubmitting } from '../../../../hooks/useDisableWhileSubmitting';
import {
  fields,
  getDefaultValues,
  resolver,
  VenueFormData,
  VenueFormProps,
} from './VenueFormUtils';

const VenueForm: React.FC<VenueFormProps> = (props) => {
  const {
    onSubmit,
    data,
    submitText,
    chapterId,
    loadingText,
    chapterData,
    adminedChapters = [],
  } = props;

  const venue = data?.venue;

  const defaultChapterId = adminedChapters[0]?.id ?? chapterId;
  const defaultValues: VenueFormData = getDefaultValues(
    defaultChapterId,
    venue,
  );
  const {
    formState: { errors, isDirty, isValid },
    handleSubmit,
    register,
  } = useForm<VenueFormData>({
    defaultValues,
    mode: 'all',
    resolver,
  });

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<VenueFormData>({
      onSubmit,
    });

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
      {chapterData ? (
        <Heading>{chapterData.chapter.name}</Heading>
      ) : (
        <Select
          label={'Chapter'}
          key={'chapter_id'}
          isRequired={true}
          isDisabled={loading}
          error={errors['chapter_id']?.message}
          options={[...adminedChapters.map(({ id, name }) => ({ id, name }))]}
          {...register('chapter_id', {
            valueAsNumber: true,
          })}
        />
      )}
      {fields.map(({ key, isRequired, label, type, step, max, min }) => {
        const error = errors[key]?.message;
        return (
          <Input
            key={key}
            label={label}
            {...register(key, {
              ...(type === 'number' && { valueAsNumber: true }),
            })}
            type={type}
            isRequired={isRequired}
            step={step}
            max={max}
            min={min}
            isDisabled={loading}
            error={error}
          />
        );
      })}
      <Button
        mt="30px"
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
    </Form>
  );
};

export default VenueForm;
