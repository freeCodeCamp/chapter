import React from 'react';
import { NextPage } from 'next';

import { useVenuesQuery } from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';
import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import getLocationString from 'helpers/getLocationString';

export const VenuesPage: NextPage = () => {
  const { loading, error, data } = useVenuesQuery();

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading>Venues</Heading>
          <LinkButton href="/dashboard/venues/new">Add new</LinkButton>
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
            data={data.venues}
            keys={['name', 'location', 'actions'] as const}
            mapper={{
              name: (venue) => (
                <LinkButton href={`/dashboard/venues/${venue.id}`}>
                  {venue.name}
                </LinkButton>
              ),
              location: (venue) => getLocationString(venue),
              actions: (venue) => (
                <LinkButton
                  colorScheme="green"
                  size="xs"
                  href={`/dashboard/venues/${venue.id}/edit`}
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
