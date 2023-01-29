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
import { Form } from '../../../components/Form/Form';
import { UpdateUserInputs } from '../../../generated/graphql';
import { fields, ProfileFormProps, resolver } from './ProfileFormUtils';
import { useDisableWhileSubmitting } from 'hooks/useDisableWhileSubmitting';
import { fieldTypeToComponent } from 'modules/util/form';

export const ProfileForm: React.FC<ProfileFormProps> = (props) => {
  const { onSubmit, data, submitText, loadingText } = props;

  const { image_url, ...rest } = data;
  const defaultValues: UpdateUserInputs = {
    image_url: image_url ?? '',
    ...rest,
  };
  const {
    handleSubmit,
    register,
    watch,
    formState: { isDirty, errors },
  } = useForm<UpdateUserInputs>({
    values: defaultValues,
    resolver,
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
      {fields.map(({ key, label, placeholder, required, type }) => {
        const Component = fieldTypeToComponent(type);
        const error = errors[key]?.message;
        return (
          <Component
            key={key}
            label={label}
            placeholder={placeholder}
            {...register(key)}
            type={type}
            isRequired={required}
            isDisabled={loading}
            error={error}
          />
        );
      })}
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
