import { Box, Heading, Flex, Spacer, Link, Badge } from '@chakra-ui/react';
import React from 'react';
import { sponsorType } from './EventFormUtils';

interface SponsorProps {
  sponsor: sponsorType;
}
const EventSponsorCard: React.FC<{ sponsors: SponsorProps[] }> = ({
  sponsors,
}) => {
  return (
    <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
      <Heading size="lg">Sponsors</Heading>
      <Spacer />
      <Flex wrap="wrap" justifyContent="center">
        {sponsors.map((item) => (
          <Box
            key={item.sponsor.id}
            p="6"
            m="6"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Heading size="sm">
              <Link href={item.sponsor.website} isExternal>
                {item.sponsor.name}
              </Link>
            </Heading>
            <Badge m="1">{item.sponsor.type}</Badge>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
export default EventSponsorCard;
