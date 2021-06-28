import React from 'react';
import { NextPage } from 'next';
import { Heading, VStack, Text, Flex } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';

import { useEventsQuery } from 'generated/graphql';
import { Layout } from '../../shared/components/Layout';
import { formatDate } from '../../../../helpers/date';

export const EventsPage: NextPage = () => {
  const { error, loading, data } = useEventsQuery();

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading>Events</Heading>
          <LinkButton href="/dashboard/events/new">Add new</LinkButton>
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
          <DataTable
            data={data.events}
            keys={
              [
                'status',
                'name',
                'venue',
                'capacity',
                'video_url',
                'date',
                'actions',
              ] as const
            }
            mapper={{
              status: (event) =>
                event.canceled ? (
                  <Text color="red.400">canceled</Text>
                ) : new Date(event.start_at) < new Date() ? (
                  'passed'
                ) : (
                  'upcoming'
                ),
              name: (event) => (
                <VStack align="flex-start">
                  {event.canceled && (
                    <Heading size="sm" color="red.400">
                      Canceled
                    </Heading>
                  )}
                  <LinkButton
                    colorScheme={event.canceled ? undefined : 'blue'}
                    href={`/dashboard/events/${event.id}`}
                  >
                    {event.name}
                  </LinkButton>
                </VStack>
              ),
              venue: (event) => event.venue?.name || '',
              capacity: true,
              video_url: true,
              date: (event) => formatDate(event.start_at),
              actions: (event) => (
                <LinkButton
                  colorScheme="green"
                  size="xs"
                  href={`/dashboard/events/${event.id}/edit`}
                >
                  Edit
                </LinkButton>
              ),
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
