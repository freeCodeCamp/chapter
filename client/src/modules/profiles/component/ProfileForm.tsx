import { Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/Form/Input';
import { TextArea } from '../../../components/Form/TextArea';
import { Form } from '../../../components/Form/Form';
import {
  UpdateMeMutationVariables,
  UpdateUserInputs,
} from '../../../generated/graphql';

interface ProfileFormProps {
  loading: boolean;
  onSubmit: (data: UpdateMeMutationVariables) => Promise<void>;
  data: UpdateMeMutationVariables;
  submitText: string;
  loadingText: string;
}

type Fields = {
  key: keyof UpdateUserInputs;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
};

const fields: Fields[] = [
  {
    key: 'name',
    label: 'New name',
    placeholder: 'Please type your new name here',
    required: true,
    type: 'text',
  },
];

export const ProfileForm: React.FC<ProfileFormProps> = (props) => {
  const { loading, onSubmit, data, submitText, loadingText } = props;

  const defaultValues: UpdateMeMutationVariables = data;
  const {
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<UpdateMeMutationVariables>({
    defaultValues,
  });

  return (
    <Form submitLabel={submitText} FormHandling={handleSubmit(onSubmit)}>
      {fields.map(({ key, label, placeholder, required, type }) =>
        type == 'textarea' ? (
          <TextArea
            key={key}
            label={label}
            placeholder={placeholder}
            {...register(data.name)}
            isRequired={required}
            isDisabled={loading}
          />
        ) : (
          <Input
            key={key}
            label={label}
            placeholder={placeholder}
            {...register(data.name)}
            type={type}
            isRequired={required}
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
    </Form>
  );
};
