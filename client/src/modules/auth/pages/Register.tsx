import { Heading, VStack } from '@chakra-ui/layout';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Input } from '../../../components/Form/Input';
import { useRegisterMutation } from '../../../generated/graphql';

interface RegisterFormData {
  name: string;
  email: string;
}

export const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const [registerMutation] = useRegisterMutation();

  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);

    try {
      await registerMutation({ variables: { ...data } });
      toast({ title: 'User registered', status: 'success' });
      router.push('/auth/login');
    } catch (err) {
      toast({ title: 'Something went wrong', status: 'error' });
      // TODO: Setup error handling
      // if (err.name === 'EMAIL_IN_USE') {
      //   setError('email', { message: 'Email alredy in use' });
      // } else {
      //   console.error(err.name);
      // }
    }
  };

  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <Heading>Register</Heading>

          <Input label="Name" {...register('name')} isRequired />
          <Input
            label="Email"
            {...register('email')}
            error={errors.email?.message}
            isRequired
          />

          <Button
            data-cy="submit-button"
            type="submit"
            mr="2"
            colorScheme="blue"
          >
            Register
          </Button>

          <Text>Already have an account?</Text>
          <LinkButton href="/auth/login">Login?</LinkButton>
        </VStack>
      </form>
    </Box>
  );
};
