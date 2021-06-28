import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import {
  Button,
  Text,
  Link,
  useBoolean,
  UseDisclosureReturn,
  VStack,
  Spinner,
  Heading,
} from '@chakra-ui/react';

import { Modal } from './Modal';
import { Input } from './Form/Input';
import { MeQuery, useLoginMutation } from 'generated/graphql';
import { meQuery } from 'modules/auth/graphql/queries';
import { useForm } from 'react-hook-form';

type FormType = {
  email: string;
  first_name?: string;
  last_name?: string;
};

export const LoginRegisterModal: React.FC<{
  modalProps: UseDisclosureReturn;
  onRsvp: (add: boolean) => void;
  userIds: number[];
}> = ({ modalProps, onRsvp, userIds }) => {
  const client = useApolloClient();
  const [login] = useLoginMutation();

  const [code, setCode] = useState<string>();
  const [error, setError] = useState<string>();

  const [isRegister, { toggle }] = useBoolean(false);

  const { handleSubmit, register } = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
    if (isRegister) {
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
              onRsvp(!userIds.includes(me.id));
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal
      modalProps={modalProps}
      title={isRegister ? 'Register' : 'Login'}
      wrapBody={(children) => (
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
            <Input {...register('email')} error={error} />

            {isRegister && (
              <>
                <Input {...register('first_name')} />
                <Input {...register('last_name')} />
              </>
            )}

            <Text fontSize="md">
              {isRegister ? 'Already a user?' : "Don't have an account?"}

              <Link ml="1" fontSize="md" onClick={toggle}>
                {isRegister ? 'Login' : 'Register'}
              </Link>
            </Text>
          </>
        )}
      </VStack>
    </Modal>
  );
};
