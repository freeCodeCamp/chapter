import { Heading, VStack, Text, Flex, HStack, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';

import { formatDate } from '../../../../util/date';
import { Layout } from '../../shared/components/Layout';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { useAuth } from '../../../auth/store';
import { useEventsQuery } from 'generated/graphql';

export const EventsPage: NextPage = () => {
  const { error, loading, data } = useEventsQuery();

  const { user } = useAuth();

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Events</Heading>
          {!!user?.admined_chapters.length && (
            <LinkButton data-cy="new-event" href="/dashboard/events/new">
              Add new
            </LinkButton>
          )}
        </Flex>

        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.events ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <Box>
            <HStack display={{ base: 'none', lg: 'block' }} marginBlock={'2em'}>
              <DataTable
                tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
                data={data.events}
                keys={
                  [
                    'status',
                    'name',
                    'invite only',
                    'venue',
                    'capacity',
                    'streaming_url',
                    'date',
                    'actions',
                  ] as const
                }
                mapper={{
                  status: (event) =>
                    event.canceled ? (
                      <Text
                        color="red.500"
                        fontSize={['md', 'lg']}
                        fontWeight={'semibold'}
                      >
                        canceled
                      </Text>
                    ) : new Date(event.start_at) < new Date() ? (
                      <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                        passed
                      </Text>
                    ) : (
                      <Text fontSize={['md', 'lg']} fontWeight={'semibold'}>
                        upcoming
                      </Text>
                    ),
                  name: (event) => (
                    <VStack align="flex-start">
                      <LinkButton
                        colorScheme={event.canceled ? 'red' : undefined}
                        href={`/dashboard/events/${event.id}`}
                      >
                        {event.name}
                      </LinkButton>
                    </VStack>
                  ),
                  'invite only': (event) => (event.invite_only ? 'Yes' : 'No'),
                  venue: (event) =>
                    isPhysical(event.venue_type)
                      ? event.venue?.name || ''
                      : 'Online only',
                  capacity: true,
                  streaming_url: (event) =>
                    isOnline(event.venue_type)
                      ? event.streaming_url
                      : 'In-person only',
                  date: (event) => formatDate(event.start_at),
                  actions: (event) => (
                    <LinkButton
                      colorScheme="blue"
                      size="sm"
                      href={`/dashboard/events/${event.id}/edit`}
                    >
                      Edit
                    </LinkButton>
                  ),
                }}
              />
            </HStack>
            <HStack display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
              {data.events.map(({ canceled, name, id, start_at }, index) => (
                <DataTable
                  key={index}
                  tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
                  data={[data.events[index]]}
                  keys={['type', 'value'] as const}
                  mapper={{
                    type: () => (
                      <HStack>
                        <Text></Text>
                      </HStack>
                    ),
                    value: () => (
                      <VStack>
                        <HStack>
                          {canceled ? (
                            <Text
                              color="red.500"
                              fontSize={['md', 'lg']}
                              fontWeight={'semibold'}
                            >
                              canceled
                            </Text>
                          ) : new Date(start_at) < new Date() ? (
                            <Text
                              fontSize={['md', 'lg']}
                              fontWeight={'semibold'}
                            >
                              passed
                            </Text>
                          ) : (
                            <Text
                              fontSize={['md', 'lg']}
                              fontWeight={'semibold'}
                            >
                              upcoming
                            </Text>
                          )}
                        </HStack>
                        <VStack align="flex-start">
                          <LinkButton
                            colorScheme={canceled ? 'red' : undefined}
                            href={`/dashboard/events/${id}`}
                          >
                            {name}
                          </LinkButton>
                        </VStack>
                        <Box>formatDate(start_at)</Box>
                        <LinkButton
                          colorScheme="blue"
                          size="sm"
                          href={`/dashboard/events/${id}/edit`}
                        >
                          Edit
                        </LinkButton>
                      </VStack>
                    ),
                  }}
                />
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </Layout>
  );
};
