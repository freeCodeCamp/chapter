import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useUnsubscribeMutation } from '../../generated/graphql';

const UnsubscribePage: NextPage = () => {
  const router = useRouter();
  const token = (router.query.token || '') as string;

  const { handleSubmit, register, watch } = useForm();

  const [unsubscribe, { loading, data, error }] = useUnsubscribeMutation({
    variables: { token },
  });

  const onUnsubscribe = async () => {
    try {
      await unsubscribe();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmed = watch('confirm');

  if (!token) {
    return <Spinner />;
  }

  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      <VStack>
        <Heading>Unsubscribing</Heading>
        {!loading && !data && !error ? (
          <form onSubmit={handleSubmit(onUnsubscribe)}>
            <HStack marginTop="1em">
              <fieldset>
                <Text as="legend" srOnly>
                  interacting with subscription
                </Text>
                <Checkbox
                  {...register('confirm' as const, { required: true })}
                  value="confirm"
                >
                  Confirm unsubscribing
                </Checkbox>
              </fieldset>
              <Button type="submit" isDisabled={!confirmed}>
                Submit
              </Button>
            </HStack>
          </form>
        ) : loading ? (
          <Spinner />
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <Text>Unsubscribed</Text>
        )}
      </VStack>
    </Box>
  );
};

export default UnsubscribePage;
