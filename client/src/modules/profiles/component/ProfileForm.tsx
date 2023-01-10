import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/Form/Input';
import { TextArea } from '../../../components/Form/TextArea';
import { Form } from '../../../components/Form/Form';
import { UpdateUserInputs } from '../../../generated/graphql';
import { useDisableWhileSubmitting } from 'hooks/useDisableWhileSubmitting';

interface ProfileFormProps {
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
    label: 'Name',
    placeholder: 'Add your name here',
    required: false,
    type: 'text',
  },
  {
    key: 'image_url',
    label: 'Profile Picture',
    placeholder: 'Add a link to a profile image here',
    required: false,
    type: 'url',
  },
];

export const ProfileForm: React.FC<ProfileFormProps> = (props) => {
  const { onSubmit, data, submitText, loadingText } = props;

  const defaultValues: UpdateUserInputs = {
    ...data,
  };
  const {
    handleSubmit,
    register,
    watch,
    formState: { isDirty },
  } = useForm<UpdateUserInputs>({
    values: defaultValues,
  });

  const hasAutoSubscribe = watch('auto_subscribe');

  const { loading, disableWhileSubmitting } =
    useDisableWhileSubmitting<UpdateUserInputs>({
      onSubmit,
      enableOnSuccess: true,
    });

  return (
    <Form
      submitLabel={submitText}
      FormHandling={handleSubmit(disableWhileSubmitting)}
    >
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
            Subscribe to chapters when joining them
          </FormLabel>
          <Switch
            id="auto_subscribe"
            {...register('auto_subscribe')}
            isDisabled={loading}
          />
        </Flex>
        <FormHelperText>
          {hasAutoSubscribe
            ? '(After joining a chapter, you will be notified about new events unless you unsubscribe.)'
            : '(After joining a chapter, you will not be notified about new events unless you subscribe.)'}
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
