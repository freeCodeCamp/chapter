import { Flex, Grid, GridItem, Heading, Tag } from '@chakra-ui/react';
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
            <GridItem key={id}>
              <Flex justifyContent="space-between">
                <LinkButton href={`/events/${id}`}>{name}</LinkButton>
                <Flex>
                  {canceled && (
                    <Tag
                      borderRadius="lg"
                      marginRight="3"
                      paddingInline="[1 , 2]"
                      paddingBlock="[.5, 1]"
                      fontSize="['small', 'md']"
                      maxWidth="8em"
                      mt="1"
                      maxH="2em"
                      colorScheme="red"
                    >
                      Canceled
                    </Tag>
                  )}
                  {invite_only && (
                    <Tag
                      borderRadius="lg"
                      mt="1"
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
                </Flex>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Heading as="h3" size="sm">
          {emptyText || 'No events'}
        </Heading>
      )}
    </>
  );
};
