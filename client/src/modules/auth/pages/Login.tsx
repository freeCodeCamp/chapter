import React, { useState } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { Heading, VStack } from '@chakra-ui/layout';
import { Box, Button, Text } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';

import { Input } from '../../../components/Form/Input';
import { useLoginMutation } from '../../../generated/graphql';

interface LoginForm {
  email: string;
}

export const LoginPage: NextPage = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [login] = useLoginMutation();

  const [code, setCode] = useState<string>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login({ variables: { email: data.email } });
      setCode(res.data?.login.code);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      {code ? (
        <>
          <Heading>We sent you a magic link to your email</Heading>
          <Heading size="md" mt="2">
            Make sure that the code in the email matches [{code}]
          </Heading>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Heading>Login</Heading>

            <Input {...register('email')} />

            <Button type="submit" mr="2" colorScheme="blue">
              Login
            </Button>

            <Text>Don&apos;t have an account yet?</Text>
            <LinkButton href="/auth/register">Register</LinkButton>
          </VStack>
        </form>
      )}
    </Box>
  );
};
