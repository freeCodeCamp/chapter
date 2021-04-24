import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Spinner } from '@chakra-ui/react';

import { useAuthenticateMutation } from 'generated/graphql';

export const TokenPage: NextPage = () => {
  const router = useRouter();
  const token = (router.query.token || '') as string;

  const [authenticate] = useAuthenticateMutation();

  useEffect(() => {
    if (token) {
      authenticate({ variables: { token } })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  return <Spinner />;
};
