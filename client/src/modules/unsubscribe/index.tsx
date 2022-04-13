import { Box, Heading, Spinner } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useUnsubscribeMutation } from '../../generated/graphql';

const UnsubscribePage: NextPage = () => {
  const router = useRouter();
  const token = (router.query.token || '') as string;

  const [unsubscribe, { loading, data }] = useUnsubscribeMutation({
    variables: { token },
  });

  useEffect(() => {
    unsubscribe();
  }, [token]);

  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      {loading ? (
        <Spinner />
      ) : (
        <Heading>
          {data?.unsubscribe ? 'You are unsubscribed' : 'Error'}
        </Heading>
      )}
    </Box>
  );
};

export default UnsubscribePage;
