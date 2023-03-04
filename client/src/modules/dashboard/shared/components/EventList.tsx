import { Flex, Grid, Heading, Tag, Text } from '@chakra-ui/react';
import React from 'react';

import { LinkButton } from 'chakra-next-link';
import { CalendarIcon, LockIcon, SettingsIcon } from '@chakra-ui/icons';

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
        <Grid gap="4em">
          {events.map(({ canceled, id, invite_only, name }) => (
            <Grid gap="1rem" key={id} gridTemplateColumns="repeat(4, 1fr)">
              <Flex marginTop="1" gap="3em" gridColumn="1 / -1">
                <Text>{name}</Text>
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
              </Flex>
              <LinkButton
                gridRow="2"
                gridColumn={{ base: '1/ -1', md: '1/3', xl: '1/2' }}
                href={`/dashboard/events/${id}`}
              >
                <Text srOnly>{name}</Text> Dashboard{' '}
                <SettingsIcon marginInlineStart=".5em" />
              </LinkButton>
              <LinkButton
                gridRow={{ base: '3', md: '2' }}
                gridColumn={{ base: '1/ -1', md: '-3/ -1', xl: '2/3' }}
                href={`/events/${id}`}
              >
                <Text srOnly>{name}</Text> Event Page{' '}
                <CalendarIcon marginInlineStart=".5em" />
              </LinkButton>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Text>{emptyText || 'No events'}</Text>
      )}
    </>
  );
};
