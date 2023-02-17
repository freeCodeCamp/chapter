import {
  Flex,
  Grid,
  Heading,
  Tag,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';

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
            <Flex justifyContent="space-between" key={id}>
              <Menu>
                <MenuButton as={Button}>{name}</MenuButton>
                <MenuList minWidth="200">
                  <MenuItem as="a" href={`/dashboard/events/${id}`}>
                    Event dashboard
                  </MenuItem>
                  <MenuItem as="a" href={`/events/${id}`}>
                    Event page
                  </MenuItem>
                </MenuList>
              </Menu>

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
            </Flex>
          ))}
        </Grid>
      ) : (
        <Text>{emptyText || 'No events'}</Text>
      )}
    </>
  );
};
