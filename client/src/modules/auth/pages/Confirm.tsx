import { NextPage } from 'next';
import React from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';

// ToDo create confirm mutation
// import { useLoginMutation } from '../../../generated/graphql';

export const ConfirmPage: NextPage = () => {
  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      <form>
        <VStack>
          <Heading>Confirm</Heading>
          <p>Please Type your password to confirm</p>
          <input type="password" />
          <input type="submit" />
        </VStack>
      </form>
    </Box>
  );
};
