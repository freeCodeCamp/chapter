import { Link, Flex } from '@chakra-ui/react';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <Flex
      as={'footer'}
      marginTop="2em"
      backgroundColor={'gray.10'}
      paddingInline="2em"
      paddingBlock="1em"
      gap="2em"
      justifyContent="space-evenly"
    >
      <Link href="/chapters" fontWeight="600">
        Chapters
      </Link>
      <Link href="/events" fontWeight="600">
        Events
      </Link>
      <Link href="/policy" fontWeight="600">
        Policy
      </Link>
      <Link
        fontWeight="600"
        href="https://www.freecodecamp.org/news/code-of-conduct/"
        isExternal
      >
        Code Of Conduct
      </Link>
    </Flex>
  );
};
