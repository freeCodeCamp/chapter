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
            <LinkButton
              data-cy="new-chapter"
              href="/dashboard/chapters/new"
              colorScheme={'blue'}
            >
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
                        colorScheme="blue"
                        size="xs"
                        href={`/dashboard/chapters/${chapter.id}/new-event`}
                      >
                        Add Event
                      </LinkButton>
                      <LinkButton
                        colorScheme="blue"
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
            <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
              {chapterData.chapters.map(({ id, name }, index) => (
                <Flex key={id}>
                  <DataTable
                    data={[chapterData.chapters[index]]}
                    keys={[' ', '_'] as const}
                    tableProps={{
                      table: { 'aria-labelledby': 'page-heading' },
                    }}
                    mapper={{
                      ' ': () => (
                        <VStack
                          align={'flex-start'}
                          spacing={'4'}
                          fontSize={['sm', 'md']}
                        >
                          <Heading
                            as="h3"
                            fontSize={['sm', 'md']}
                            marginBlock={'2'}
                          >
                            Name
                          </Heading>
                          <Heading as="h3" fontSize={['sm', 'md']}>
                            Ops
                          </Heading>
                        </VStack>
                      ),
                      _: () => (
                        <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                          <LinkButton
                            href={`/dashboard/chapters/${id}`}
                            marginBottom={'.5em'}
                            width="100%"
                            size={'sm'}
                          >
                            {name}
                          </LinkButton>
                          <HStack spacing={1} marginLeft={'-1em'}>
                            <LinkButton
                              colorScheme="blue"
                              size="xs"
                              href={`/dashboard/chapters/${id}/new-event`}
                            >
                              Add Event
                            </LinkButton>
                            <LinkButton
                              colorScheme="blue"
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
          </>
        )}
      </VStack>
    </Layout>
  );
};
