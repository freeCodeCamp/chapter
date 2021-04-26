import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Spinner } from '@chakra-ui/react';

import { useAuthenticateMutation } from 'generated/graphql';
import { Heading, VStack } from '@chakra-ui/layout';
import { useAuthStore } from '../store';
import { meQuery } from '../graphql/queries';

export const TokenPage: NextPage = () => {
  const router = useRouter();
  const token = (router.query.token || '') as string;

  const { setData } = useAuthStore();

  const [authenticate] = useAuthenticateMutation({
    refetchQueries: [{ query: meQuery }],
  });

  useEffect(() => {
    if (token) {
      authenticate({ variables: { token } })
        .then(({ data }) => {
          if (data) {
            setData({ user: { ...data.authenticate.user } });
            // TODO: Move to cookies so we can more easily preload stuff on the server
            window.localStorage.setItem('token', data.authenticate.token);

            return router.push('/');
          }
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <VStack>
      <Heading>Logging you in</Heading>
      <Spinner />
    </VStack>
  );
};
