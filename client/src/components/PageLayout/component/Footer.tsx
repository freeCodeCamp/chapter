import { Link, Grid } from '@chakra-ui/react';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <Grid
      as={'footer'}
      marginTop="2em"
      backgroundColor={'gray.10'}
      paddingInline="2em"
      paddingBlock="1em"
      gap="3em"
      gridTemplateColumns="repeat(auto-fit, minmax(8rem, 1fr))"
    >
      <Link href="/chapters" fontWeight="600">
        Chapters
      </Link>
      <Link href="/events" fontWeight="600">
        Events
      </Link>
      <Link
        href="https://www.freecodecamp.org/news/privacy-policy/"
        fontWeight="600"
        isExternal
      >
        Policy
      </Link>
      <Link
        href="https://www.freecodecamp.org/news/terms-of-service/"
        fontWeight="600"
        isExternal
      >
        Terms Of Service
      </Link>
      <Link
        fontWeight="600"
        href="https://www.freecodecamp.org/news/code-of-conduct/"
        isExternal
      >
        Code Of Conduct
      </Link>
    </Grid>
  );
};
