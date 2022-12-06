import { Box, Heading, Flex, Link, Badge } from '@chakra-ui/react';
import React from 'react';

import { Sponsor } from '../generated/graphql';

interface SponsorsProps {
  sponsors: { sponsor: Sponsor }[];
}

const SponsorsCard = ({ sponsors }: SponsorsProps) => {
  return (
    <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
      <Heading as="h2" fontSize={['sm', 'md', 'lg']}>
        Sponsors
      </Heading>
      <Flex wrap="wrap" justifyContent="center">
        {sponsors.map(({ sponsor }) => (
          <Box
            key={sponsor.id}
            p="6"
            m="6"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Link href={sponsor.website} size="sm" isExternal>
              {sponsor.name}
            </Link>
            <Badge m="1">{sponsor.type}</Badge>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
export default SponsorsCard;
