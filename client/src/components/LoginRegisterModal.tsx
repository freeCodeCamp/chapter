import { useApolloClient } from '@apollo/client';
import {
  Button,
  Text,
  useBoolean,
  UseDisclosureReturn,
  VStack,
  Spinner,
  Heading,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { Input } from './Form/Input';
import { Modal } from './Modal';
import {
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from 'generated/graphql';
import { meQuery } from 'modules/auth/graphql/queries';

interface LoginData {
  email: string;
}

interface RegisterData extends LoginData {
  name: string;
}

export const LoginRegisterModal: React.FC<{
  modalProps: UseDisclosureReturn;
  action: (condition: boolean) => void;
  userIds: number[];
}> = ({ modalProps, action, userIds }) => {
  const client = useApolloClient();
  const [login] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();

  const [code, setCode] = useState<string>();
  const [error, setError] = useState<string>();

  const [isRegister, { toggle }] = useBoolean(false);

  const { handleSubmit, register } = useForm<RegisterData>();

  const toast = useToast();

  const onSubmit = async (data: LoginData | RegisterData) => {
    if (isRegister) {
      if ('last_name' in data) {
        try {
          await registerMutation({ variables: { ...data } });
          toast({ title: 'User registered', status: 'success' });
          toggle();
        } catch (err) {
          toast({ title: 'Something went wrong', status: 'error' });
          // TODO: error handling
        }
      }
      return;
    }

    try {
      const res = await login({ variables: { email: data.email } });
      setError(undefined);

      if (res.data) {
        setCode(res.data.login.code);
      }

      const interval = setInterval(() => {
        console.log(localStorage.getItem('token'));
        client
          .query<MeQuery>({ query: meQuery, fetchPolicy: 'network-only' })
          .then((data) => {
            const { me } = data.data;
            if (me) {
              clearInterval(interval);
              modalProps.onClose();
              action(!userIds.includes(me.id));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
        console.log(err);
      }
    }
  };

  return (
    <Modal
      modalProps={modalProps}
      title={isRegister ? 'Register' : 'Login'}
      wrapChildren={(children) => (
        <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
      )}
      buttons={
        <>
          <Button type="submit">{isRegister ? 'Register' : 'Login'}</Button>
        </>
      }
    >
      <VStack align="flex-start">
        {code ? (
          <>
            <Heading size="md">We sent you a magic link to your email</Heading>
            <Heading size="md">
              Make sure that the code in the email matches [{code}]
            </Heading>

            <Heading size="md">
              You&apos;ll stay on this page after login, just open the link the
              same browser
            </Heading>

            <Spinner />
          </>
        ) : (
          <>
            <Input
              label="Email"
              {...register('email')}
              error={error}
              isRequired
            />

            {isRegister && (
              <>
                <Input label="Name" {...register('name')} isRequired />
              </>
            )}

            <Text fontSize="md">
              {isRegister ? 'Already a user?' : "Don't have an account?"}

              <Button ml="1" fontSize="md" onClick={toggle}>
                {isRegister ? 'Login' : 'Register'}
              </Button>
            </Text>
          </>
        )}
      </VStack>
    </Modal>
  );
};
