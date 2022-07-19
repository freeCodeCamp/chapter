import { Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';

import { useCheckPermission } from '../../../../hooks/useCheckPermission';
import { useChaptersQuery } from '../../../../generated/graphql';
import { Layout } from '../../shared/components/Layout';
import { Permission } from '../../../../../../common/permissions';

export const ChaptersPage: NextPage = () => {
  const {
    loading: chapterLoading,
    error: chapterError,
    data: chapterData,
  } = useChaptersQuery();

  const hasPermissionToCreateChapter = useCheckPermission(
    Permission.ChapterCreate,
  );

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Chapters</Heading>
          {hasPermissionToCreateChapter && (
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
                <HStack>
                  <LinkButton
                    colorScheme="green"
                    size="xs"
                    href={`/dashboard/chapters/${chapter.id}/edit`}
                  >
                    Edit
                  </LinkButton>
                  <LinkButton
                    size="xs"
                    href={`/dashboard/chapters/${chapter.id}/new-event`}
                  >
                    Add Event
                  </LinkButton>
                  <LinkButton
                    size="xs"
                    href={`/dashboard/chapters/${chapter.id}/new-venue`}
                  >
                    Add Venue
                  </LinkButton>
                </HStack>
              ),
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
