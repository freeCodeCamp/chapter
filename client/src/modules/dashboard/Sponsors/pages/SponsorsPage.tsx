import { VStack, Flex, Heading, Text, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import Head from 'next/head';
import React, { ReactElement } from 'react';

import { checkInstancePermission } from '../../../../util/check-permission';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Permission } from '../../../../../../common/permissions';
import { useSponsorsQuery } from '../../../../generated/graphql';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useUser } from '../../../auth/user';

export const SponsorsPage: NextPageWithLayout = () => {
  const { loading, error, data } = useSponsorsQuery();
  const { user, loadingUser } = useUser();

  const hasPermissionToManageSponsor = checkInstancePermission(
    user,
    Permission.SponsorManage,
  );

  const isLoading = loading || loadingUser || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  return (
    <>
      <Head>
        <title>Sponsors</title>
      </Head>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Sponsors</Heading>
          {hasPermissionToManageSponsor && (
            <LinkButton href="/dashboard/sponsors/new" colorScheme="blue">
              Add new
              <Text srOnly as="span">
                sponsor
              </Text>
            </LinkButton>
          )}
        </Flex>
        <Box display={{ base: 'none', lg: 'block' }} width={'100%'}>
          <DataTable
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            data={data.sponsors}
            keys={['name', 'type', 'website', 'action'] as const}
            mapper={{
              name: (sponsor) => (
                <LinkButton href={`/dashboard/sponsors/${sponsor.id}`}>
                  {sponsor.name}
                </LinkButton>
              ),
              type: (sponsor) => sponsor.type,
              website: (sponsor) => sponsor.website,
              action: (sponsor) =>
                hasPermissionToManageSponsor && (
                  <LinkButton
                    colorScheme="blue"
                    size="xs"
                    href={`/dashboard/sponsors/${sponsor.id}/edit`}
                  >
                    Edit
                    <Text srOnly as="span">
                      {sponsor.name}
                    </Text>
                  </LinkButton>
                ),
            }}
          />
        </Box>

        <Box display={{ base: 'block', lg: 'none' }}>
          {data.sponsors.map(({ name, type, website, id }, index) => (
            <DataTable
              key={id}
              tableProps={{
                table: { 'aria-labelledby': 'page-heading' },
              }}
              data={[data.sponsors[index]]}
              keys={['type', 'action'] as const}
              showHeader={false}
              mapper={{
                type: () => (
                  <VStack
                    fontWeight={700}
                    align={'flex-start'}
                    fontSize={['sm', 'md']}
                    marginBlock={'1.5em'}
                  >
                    <Text marginBlock={'.54em'}>Name</Text>
                    <Text>Type</Text>
                    {hasPermissionToManageSponsor && <Text>Ops</Text>}
                    <Text>Website</Text>
                  </VStack>
                ),
                action: () => (
                  <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                    <LinkButton href={`/dashboard/sponsors/${id}`} size={'sm'}>
                      {name}
                    </LinkButton>
                    <Text>{type}</Text>
                    {hasPermissionToManageSponsor && (
                      <LinkButton
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/sponsors/${id}/edit`}
                      >
                        Edit
                        <Text srOnly as="span">
                          {name}
                        </Text>
                      </LinkButton>
                    )}
                    <Text
                      size={'sm'}
                      wordBreak="break-all"
                      maxWidth="sm"
                      noOfLines={1}
                    >
                      {website}
                    </Text>
                  </VStack>
                ),
              }}
            />
          ))}
        </Box>
      </VStack>
    </>
  );
};

SponsorsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
