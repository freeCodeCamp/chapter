import {
  Grid,
  Heading,
  Tag,
  Text,
  HStack,
  GridItem,
  Box,
} from '@chakra-ui/react';
import React from 'react';

import { LinkButton } from 'chakra-next-link';
import { LockIcon } from '@chakra-ui/icons';

interface Event {
  canceled: boolean;
  id: number;
  invite_only: boolean;
  name: string;
}

interface Props {
  events: Event[];
  emptyText?: string;
  title: string;
}

export const EventList = ({ events, emptyText, title }: Props) => {
  return (
    <>
      <Heading as="h2" marginBlock="1em" fontSize="lg">
        {title}
      </Heading>
      {events.length > 0 ? (
        <Grid gap="2em">
          {events.map(({ canceled, id, invite_only, name }) => (
            <Grid templateColumns="repeat(3, 1fr)" gap={10} key={id}>
              <GridItem>
                <Text>{name}</Text>
              </GridItem>

              <GridItem>
                <HStack>
                  <LinkButton href={`/dashboard/events/${id}`}>
                    {'Event Dashboard'}
                  </LinkButton>
                  <LinkButton href={`/events/${id}`}>{'Event Page'}</LinkButton>
                </HStack>
              </GridItem>

              <GridItem>
                <Box display="flex" justifyContent={'flex-end'}>
                  <HStack marginTop="1" gap="1em">
                    {invite_only && (
                      <Tag
                        borderRadius="lg"
                        paddingInline="[1 , 2]"
                        paddingBlock="[.5, 1]"
                        colorScheme="blue"
                        fontSize="['small', 'md']"
                        maxWidth="8em"
                        maxH="2em"
                      >
                        <LockIcon />
                        Invite only
                      </Tag>
                    )}
                    {canceled && (
                      <Tag
                        borderRadius="lg"
                        paddingInline="[1 , 2]"
                        paddingBlock="[.5, 1]"
                        fontSize="['small', 'md']"
                        maxWidth="8em"
                        maxH="2em"
                        colorScheme="red"
                      >
                        Canceled
                      </Tag>
                    )}
                  </HStack>
                </Box>
              </GridItem>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Text>{emptyText || 'No events'}</Text>
      )}
    </>
  );
};
