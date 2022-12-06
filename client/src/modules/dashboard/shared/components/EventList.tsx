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
  title: string;
}

export const EventList = ({ events, title }: Props) => {
  return (
    <>
      <Heading as="h2" marginBlock="1em" fontSize="lg">
        {title}
      </Heading>
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
                    background="gray.85"
                    color="gray.10"
                    _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
                    _focusVisible={{
                      outlineColor: 'blue.600',
                      outlineOffset: '1px',
                      boxShadow: 'none',
                    }}
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
    </>
  );
};
