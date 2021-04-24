import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Spinner } from '@chakra-ui/react';

import { useAuthenticateMutation } from 'generated/graphql';
import { useParam } from '../../../hooks/useParam';

export const TokenPage: NextPage = () => {
  const token = useParam('token', 'string');

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
