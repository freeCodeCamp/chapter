import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
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
          <Heading data-cy="chapter-dash-heading" id="page-heading">
            Chapters
          </Heading>
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
          <>
            <Box display={{ base: 'none', lg: 'block' }} width="100%">
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
                        colorScheme="blue"
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
            </Box>
            <Box display={{ base: 'block', lg: 'none' }}>
              <Box>
                {chapterData.chapters.map(({ id, name }, index) => (
                  <Flex key={id}>
                    <DataTable
                      data={[chapterData.chapters[index]]}
                      keys={['type', 'values'] as const}
                      tableProps={{
                        table: { 'aria-labelledby': 'page-heading' },
                      }}
                      mapper={{
                        type: () => (
                          <>
                            <Heading
                              as="h4"
                              fontSize={'md'}
                              marginBlock={'2em'}
                            >
                              Name
                            </Heading>
                            <Heading
                              as="h4"
                              fontSize={'md'}
                              marginBlock={'1.5em'}
                            >
                              Action
                            </Heading>
                          </>
                        ),
                        values: () => (
                          <VStack>
                            <LinkButton
                              href={`/dashboard/chapters/${id}`}
                              marginBottom={'.5em'}
                              marginLeft={'-1em'}
                              width="100%"
                            >
                              {name}
                            </LinkButton>
                            <HStack spacing={1} marginLeft={'-1em'}>
                              <LinkButton
                                size="xs"
                                href={`/dashboard/chapters/${id}/new-event`}
                              >
                                Add Event
                              </LinkButton>
                              <LinkButton
                                size="xs"
                                href={`/dashboard/chapters/${id}/new-venue`}
                              >
                                Add Venue
                              </LinkButton>
                              <LinkButton
                                colorScheme="blue"
                                size="xs"
                                href={`/dashboard/chapters/${id}/edit`}
                              >
                                Edit
                              </LinkButton>
                            </HStack>
                          </VStack>
                        ),
                      }}
                    />
                  </Flex>
                ))}
              </Box>
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  );
};
