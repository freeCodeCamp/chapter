import { VStack, Flex, Text, Heading, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement } from 'react';

import { useDashboardVenuesQuery } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import getLocationString from '../../../../util/getLocationString';
import { useUser } from '../../../auth/user';
import { NextPageWithLayout } from '../../../../pages/_app';

export const VenuesPage: NextPageWithLayout = () => {
  const { loading, error, data } = useDashboardVenuesQuery();

  const { user } = useUser();
  const adminedChapters = user?.admined_chapters ?? [];

  const isLoading = loading || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <VStack>
      <Flex w="full" justify="space-between">
        <Heading id="page-heading">Venues</Heading>
        {adminedChapters.length > 0 && (
          <LinkButton
            data-cy="new-venue"
            href="/dashboard/venues/new"
            colorScheme={'blue'}
          >
            Add new
            <Text srOnly as="span">
              venue
            </Text>
          </LinkButton>
        )}
      </Flex>

      <Box display={{ base: 'none', lg: 'block' }} width={'100%'}>
        <DataTable
          tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
          data={data.dashboardVenues}
          keys={['name', 'location', 'chapter', 'action'] as const}
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
            action: (venue) => (
              <LinkButton
                data-cy="edit-venue-button"
                colorScheme="blue"
                size="xs"
                href={`/dashboard/chapters/${venue.chapter_id}/venues/${venue.id}/edit`}
              >
                Edit
                <Text srOnly as="span">
                  {venue.name}
                </Text>
              </LinkButton>
            ),
          }}
        />
      </Box>

      <Box display={{ base: 'block', lg: 'none' }}>
        {data.dashboardVenues.map(
          (
            { id, name, chapter, chapter_id, region, postal_code, country },
            index,
          ) => (
            <DataTable
              key={id}
              tableProps={{
                table: { 'aria-labelledby': 'page-heading' },
              }}
              data={[data.dashboardVenues[index]]}
              showHeader={false}
              keys={['type', 'action'] as const}
              mapper={{
                type: () => (
                  <VStack
                    fontWeight={700}
                    spacing={5}
                    align={'flex-start'}
                    fontSize={['sm', 'md']}
                    marginBlock={'1em'}
                  >
                    <Text>Venue</Text>
                    <Text>Chapter</Text>
                    <Text>Location</Text>
                    <Text>Action</Text>
                  </VStack>
                ),
                action: () => (
                  <VStack
                    align={'flex-start'}
                    spacing={3}
                    fontSize={['sm', 'md']}
                    minWidth={'17em'}
                  >
                    <LinkButton
                      data-cy="view-venue-button"
                      href={`/dashboard/venues/${id}`}
                      size={'sm'}
                    >
                      {name}
                    </LinkButton>
                    <LinkButton
                      data-cy="view-chapter-button"
                      href={`/dashboard/chapters/${chapter.id}`}
                      size={'sm'}
                    >
                      {chapter.name}
                    </LinkButton>
                    <Text>
                      {' '}
                      {region}, {country}, {postal_code}
                    </Text>
                    <LinkButton
                      data-cy="edit-venue-button"
                      colorScheme="blue"
                      size="xs"
                      href={`/dashboard/chapters/${chapter_id}/venues/${id}/edit`}
                    >
                      Edit
                      <Text srOnly as="span">
                        {name}
                      </Text>
                    </LinkButton>
                  </VStack>
                ),
              }}
            />
          ),
        )}
      </Box>
    </VStack>
  );
};

VenuesPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
