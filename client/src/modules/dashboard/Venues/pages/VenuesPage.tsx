import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';

import { useVenuesQuery } from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';
import getLocationString from '../../../../util/getLocationString';
import { useAuth } from '../../../auth/store';

export const VenuesPage: NextPage = () => {
  const { loading, error, data } = useVenuesQuery();

  const { user } = useAuth();
  const adminedChapters = user?.admined_chapters ?? [];

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Venues</Heading>
          {adminedChapters.length > 0 && (
            <LinkButton data-cy="new-venue" href="/dashboard/venues/new">
              Add new
            </LinkButton>
          )}
        </Flex>
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.venues ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            data={data.venues}
            keys={['name', 'location', 'chapter', 'actions'] as const}
            mapper={{
              name: (venue) => (
                <LinkButton
                  data-cy="view-venue-button"
                  href={`/dashboard/venues/${venue.id}`}
                >
                  {venue.name}
                </LinkButton>
              ),
              location: (venue) => getLocationString(venue),
              chapter: ({ chapter }) => (
                <LinkButton
                  data-cy="view-chapter-button"
                  href={`/dashboard/chapters/${chapter.id}`}
                >
                  {chapter.name}
                </LinkButton>
              ),
              actions: (venue) => (
                <LinkButton
                  data-cy="edit-venue-button"
                  colorScheme="green"
                  size="xs"
                  href={`/dashboard/chapters/${venue.chapter_id}/venues/${venue.id}/edit`}
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
