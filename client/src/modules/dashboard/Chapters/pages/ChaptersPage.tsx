import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';

import { useChaptersQuery, useMeQuery } from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';

export const ChaptersPage: NextPage = () => {
  const {
    loading: chapterLoading,
    error: chapterError,
    data: chapterData,
  } = useChaptersQuery();
  const { loading: meLoading, error: meError, data: meData } = useMeQuery();

  // TODO: this is stringly typed and should be refactored. This, and the prisma
  // factories, should both draw from a single source of truth (an enum,
  // probably)

  // TODO: Also, the hasPermission function should be a helper, since this page
  // does not need to know the details of the permissions system.
  const hasPermissionToCreateChapter =
    meData?.me?.instance_role.instance_role_permissions.find(
      (x) => x.instance_permission.name === 'chapter-create',
    );

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Chapters</Heading>
          {meLoading ? (
            <Heading data-cy="me-loading">Loading...</Heading>
          ) : meError ? (
            <>
              <Heading>Error</Heading>
              <Text>
                {meError?.name}: {meError?.message}
              </Text>
            </>
          ) : !hasPermissionToCreateChapter ? null : (
            <LinkButton data-cy="new-chapter" href="/dashboard/chapters/new">
              Add new
            </LinkButton>
          )}
        </Flex>
        {chapterLoading ? (
          <Heading>Loading...</Heading>
        ) : chapterError || !chapterData?.chapters ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {chapterError?.name}: {chapterError?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={chapterData.chapters}
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
