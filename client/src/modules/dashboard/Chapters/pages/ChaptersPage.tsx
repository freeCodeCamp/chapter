import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';

import { useChaptersQuery } from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';

export const ChaptersPage: NextPage = () => {
  const { loading, error, data } = useChaptersQuery();

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Chapters</Heading>
          <LinkButton data-cy="new-chapter" href="/dashboard/chapters/new">
            Add new
          </LinkButton>
        </Flex>
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.chapters ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={data.chapters}
            keys={['name', 'actions'] as const}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            mapper={{
              name: (chapter) => (
                <LinkButton href={`/dashboard/chapters/${chapter.id}`}>
                  {chapter.name}
                </LinkButton>
              ),
              actions: (chapter) => (
                <LinkButton
                  colorScheme="green"
                  size="xs"
                  href={`/dashboard/chapters/${chapter.id}/edit`}
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
