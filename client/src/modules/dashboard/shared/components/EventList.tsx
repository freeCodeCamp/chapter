import { Flex, Grid, Heading, Tag, Text } from '@chakra-ui/react';
import React from 'react';

import { LinkButton } from 'chakra-next-link';

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
            <Flex justifyContent="space-between" key={id}>
              <LinkButton href={`/dashboard/events/${id}`}>{name}</LinkButton>
              <Flex marginTop="1" gap="1em">
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
              </Flex>
            </Flex>
          ))}
        </Grid>
      ) : (
        <Text>{emptyText || 'No events'}</Text>
      )}
    </>
  );
};
