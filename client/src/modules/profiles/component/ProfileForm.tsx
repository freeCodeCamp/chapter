import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/Form/Input';
import { TextArea } from '../../../components/Form/TextArea';
import { Form } from '../../../components/Form/Form';
import { UpdateUserInputs } from '../../../generated/graphql';

interface ProfileFormProps {
  loading: boolean;
  onSubmit: (data: UpdateUserInputs) => Promise<void>;
  data: UpdateUserInputs;
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
    required: false,
    type: 'text',
  },
  {
    key: 'image_url',
    label: 'Profile Picture',
    placeholder: 'Link your new profile picture here',
    required: false,
    type: 'url',
  },
];

export const ProfileForm: React.FC<ProfileFormProps> = (props) => {
  const { loading, onSubmit, data, submitText, loadingText } = props;

  const defaultValues: UpdateUserInputs = {
    ...data,
  };
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<UpdateUserInputs>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [data]);

  const hasAutoSubscribe = watch('auto_subscribe');

  return (
    <Form submitLabel={submitText} FormHandling={handleSubmit(onSubmit)}>
      {fields.map(({ key, label, placeholder, required, type }) =>
        type == 'textarea' ? (
          <TextArea
            key={key}
            label={label}
            placeholder={placeholder}
            {...register(key)}
            isRequired={required}
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
            isDisabled={loading}
          />
        ),
      )}
      <FormControl>
        <Flex>
          <FormLabel htmlFor="auto_subscribe">
            Automatic chapter subscription
          </FormLabel>
          <Switch
            id="auto_subscribe"
            {...register('auto_subscribe')}
            isDisabled={loading}
          />
        </Flex>
        <FormHelperText>
          {hasAutoSubscribe
            ? 'Automatically subscribe to chapter when joining it and receive emails about new events in chapter.'
            : "Don't automatically subscribe to joined chapters."}
        </FormHelperText>
      </FormControl>
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
