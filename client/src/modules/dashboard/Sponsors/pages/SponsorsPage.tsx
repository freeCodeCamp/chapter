import { VStack, Flex, Heading, Text, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Layout } from '../../shared/components/Layout';
import { useSponsorsQuery } from 'generated/graphql';

export const SponsorsPage: NextPage = () => {
  const { loading, error, data } = useSponsorsQuery();

  return (
    <>
      <Head>
        <title>Sponsors</title>
      </Head>
      <Layout>
        <VStack>
          <Flex w="full" justify="space-between">
            <Heading id="page-heading">Sponsors</Heading>
            <LinkButton href="/dashboard/sponsors/new" colorScheme={'blue'}>
              Add new
            </LinkButton>
          </Flex>
          {loading ? (
            <Heading> Loading Sponsors...</Heading>
          ) : error || !data?.sponsors ? (
            <>
              <Heading>Error while loading sponsors</Heading>
              <Text>
                {error?.name}:{error?.message}
              </Text>
            </>
          ) : (
            <Box width={'100%'}>
              <Box display={{ base: 'none', lg: 'block' }}>
                <DataTable
                  tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
                  data={data.sponsors}
                  keys={['name', 'type', 'website', 'actions'] as const}
                  mapper={{
                    name: (sponsor) => (
                      <LinkButton href={`/dashboard/sponsors/${sponsor.id}`}>
                        {sponsor.name}
                      </LinkButton>
                    ),
                    type: (sponsor) => sponsor.type,
                    website: (sponsor) => sponsor.website,
                    actions: (sponsor) => (
                      <LinkButton
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/sponsors/${sponsor.id}/edit`}
                      >
                        Edit
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
                    keys={[' ', '_'] as const}
                    mapper={{
                      ' ': () => (
                        <VStack
                          fontWeight={700}
                          align={'flex-start'}
                          fontSize={['sm', 'md']}
                          spacing={4}
                        >
                          <Text>Name</Text>
                          <Text>Type</Text>
                          <Text>Website</Text>
                          <Text>Ops</Text>
                        </VStack>
                      ),
                      _: () => (
                        <VStack
                          align={'flex-start'}
                          spacing={2.5}
                          fontSize={['sm', 'md']}
                        >
                          <LinkButton
                            href={`/dashboard/sponsers/${id}`}
                            size={'sm'}
                          >
                            {name}
                          </LinkButton>
                          <Text>{type}</Text>
                          <Text size={'sm'}>{website}</Text>
                          <LinkButton
                            colorScheme="blue"
                            size="xs"
                            href={`/dashboard/sponsers/${id}/edit`}
                          >
                            Edit
                          </LinkButton>
                        </VStack>
                      ),
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </VStack>
      </Layout>
    </>
  );
};
