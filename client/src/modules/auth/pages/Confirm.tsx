import { NextPage } from 'next';
import React from 'react';
import { Box, VStack, Heading, Input, Text } from '@chakra-ui/react';

export const ConfirmPage: NextPage = () => {
  return (
    <Box w="50%" maxW="800px" marginX="auto" mt="10">
      <form>
        <VStack>
          <Heading as="h1">Confirm</Heading>
          <Text fontSize={'large'}>Please Type your password to confirm</Text>
          <Input
            background={'gray.15'}
            color={'gray.90'}
            type="password"
            required
          />
          <Input
            type="submit"
            paddingInline={2}
            paddingBlock={1}
            maxW={'15em'}
            fontWeight={500}
            textTransform={'uppercase'}
            background={'gray.85'}
            color={'gray.10'}
          />
        </VStack>
      </form>
    </Box>
  );
};
