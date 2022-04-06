import { Box, Heading, Flex, Spacer, Link, Badge } from '@chakra-ui/react';
import React from 'react';

import { Sponsor } from '../generated/graphql';

interface SponsorsProps {
  sponsors: { sponsor: Sponsor }[];
}

const SponsorsCard = ({ sponsors }: SponsorsProps) => {
  return (
    <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
      <Heading size="lg">Sponsors</Heading>
      <Spacer />
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
            <Heading size="sm">
              <Link href={sponsor.website} isExternal>
                {sponsor.name}
              </Link>
            </Heading>
            <Badge m="1">{sponsor.type}</Badge>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
export default SponsorsCard;
