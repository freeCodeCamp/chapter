import React from 'react';
import { NextPage } from 'next';
import { Heading, VStack } from '@chakra-ui/layout';
import { useForm } from 'react-hook-form';
import { Box, Button, Text } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';

import { Input } from '../../../components/Form/Input';
import { useRegisterMutation } from '../../../generated/graphql';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
}

export const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const [registerMutation] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);

    try {
      const res = await registerMutation({ variables: { ...data } });
      console.log(res);
    } catch (err) {
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

          <Input {...register('first_name')} />
          <Input {...register('last_name')} />
          <Input {...register('email')} error={errors.email?.message} />

          <Button type="submit" mr="2" colorScheme="blue">
            Register
          </Button>

          <Text>Already have an account?</Text>
          <LinkButton href="/auth/login">Login?</LinkButton>
        </VStack>
      </form>
    </Box>
  );
};
