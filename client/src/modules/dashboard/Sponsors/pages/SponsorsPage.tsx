import { VStack, Flex, Heading, Text, Box } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { Link, LinkButton } from 'chakra-next-link';
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
            <LinkButton href="/dashboard/sponsors/new">Add new</LinkButton>
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
                    keys={['types', 'value'] as const}
                    mapper={{
                      types: () => (
                        <VStack
                          fontWeight={500}
                          align={'flex-start'}
                          spacing={4}
                        >
                          <Text>Name</Text>
                          <Text>Type</Text>
                          <Text>Website</Text>
                          <Text>Action</Text>
                        </VStack>
                      ),
                      value: () => (
                        <VStack align={'flex-start'}>
                          <LinkButton
                            href={`/dashboard/sponsers/${id}`}
                            size={'sm'}
                          >
                            {name}
                          </LinkButton>
                          <Text>{type}</Text>
                          <Link size={'sm'} href={''}>
                            {website}
                          </Link>
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
