import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import React, { ReactElement, useState } from 'react';

import {
  checkInstancePermission,
  checkChapterPermission,
} from '../../../../util/check-permission';
import { useDashboardChaptersQuery } from '../../../../generated/graphql';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { DashboardLayout } from '../../shared/components/DashboardLayout';
import { Permission } from '../../../../../../common/permissions';
import { NextPageWithLayout } from '../../../../pages/_app';
import { useUser } from '../../../auth/user';

const actionLinks = [
  {
    colorScheme: 'blue',
    size: 'xs',
    href: (id: number) => `/dashboard/chapters/${id}/new-venue`,
    text: 'Add venue',
    requiredPermission: Permission.VenueCreate,
  },
  {
    colorScheme: 'blue',
    size: 'xs',
    href: (id: number) => `/dashboard/chapters/${id}/new-event`,
    text: 'Add Event',
    requiredPermission: Permission.EventCreate,
  },
  {
    colorScheme: 'blue',
    size: 'xs',
    href: (id: number) => `/dashboard/chapters/${id}/edit`,
    text: 'Edit',
    requiredPermission: Permission.EventEdit,
  },
];

export const ChaptersPage: NextPageWithLayout = () => {
  const [filterChapter, setFilterChapter] = useState('');
  const { loading, error, data } = useDashboardChaptersQuery();
  const { user, loadingUser } = useUser();

  const hasPermissionToCreateChapter = checkInstancePermission(
    user,
    Permission.ChapterCreate,
  );

  const isLoading = loading || loadingUser || !data;
  if (isLoading || error) return <DashboardLoading error={error} />;

  const filteredChapters = data.dashboardChapters.filter(({ name }) =>
    name.toLowerCase().includes(filterChapter.toLowerCase().trim()),
  );

  return (
    <VStack>
      <Grid w="full" gap="1em" gridTemplateColumns="1fr 2fr 8em">
        <Heading data-cy="chapter-dash-heading" id="page-heading">
          Chapters
        </Heading>
        {data.dashboardChapters.length > 1 && (
          <>
            <Text srOnly>
              Type the name of chapter that you are looking for in the filter
              chapter input to filter out other chapters
            </Text>
            <InputGroup gridRowStart="2" gridColumnStart="1" gridColumnEnd="-1">
              <InputLeftElement pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                width="full"
                type="text"
                backgroundColor="gray.50"
                placeholder="Filter Chapter"
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value)}
              />
            </InputGroup>
          </>
        )}
        {hasPermissionToCreateChapter && (
          <LinkButton
            data-cy="new-chapter"
            href="/dashboard/chapters/new"
            colorScheme={'blue'}
            gridColumnStart={-2}
            gridColumnEnd={-1}
            marginLeft="auto"
          >
            Add new
            <Text srOnly as="span">
              chapter
            </Text>
          </LinkButton>
        )}
      </Grid>
      <Box display={{ base: 'none', lg: 'block' }} width="100%">
        <DataTable
          data={filteredChapters}
          keys={['name', 'actions'] as const}
          tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
          mapper={{
            name: (chapter) => (
              <LinkButton
                data-cy="chapter"
                href={`/dashboard/chapters/${chapter.id}`}
              >
                {chapter.name}
              </LinkButton>
            ),
            actions: (chapter) => (
              <HStack>
                {actionLinks
                  .filter(
                    ({ requiredPermission }) =>
                      !requiredPermission ||
                      checkChapterPermission(user, requiredPermission, {
                        chapterId: chapter.id,
                      }),
                  )
                  .map(({ colorScheme, size, text, href }) => (
                    <LinkButton
                      key={text}
                      colorScheme={colorScheme}
                      size={size}
                      href={href(chapter.id)}
                    >
                      {text}
                      <Text srOnly as="span">
                        {text !== 'Edit'
                          ? `for ${chapter.name}`
                          : `${chapter.name}`}
                      </Text>
                    </LinkButton>
                  ))}
              </HStack>
            ),
          }}
        />
      </Box>
      <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
        {filteredChapters.map((chapter) => (
          <Flex key={chapter.id}>
            <DataTable
              data={[chapter]}
              keys={['type', 'actions'] as const}
              showHeader={false}
              tableProps={{
                table: { 'aria-labelledby': 'page-heading' },
              }}
              mapper={{
                type: () => (
                  <VStack
                    align={'flex-start'}
                    spacing={'4'}
                    fontSize={['sm', 'md']}
                    marginBlock={'1.5em'}
                  >
                    <Heading as="h3" fontSize={['sm', 'md']} marginBlock={'1'}>
                      Name
                    </Heading>
                    <Heading as="h3" fontSize={['sm', 'md']}>
                      Actions
                    </Heading>
                  </VStack>
                ),
                actions: () => (
                  <VStack align={'flex-start'} fontSize={['sm', 'md']}>
                    <LinkButton
                      data-cy="chapter"
                      href={`/dashboard/chapters/${chapter.id}`}
                      marginBottom={'.5em'}
                      width="100%"
                      size={'sm'}
                    >
                      {chapter.name}
                    </LinkButton>
                    <HStack spacing={1} marginLeft={'-1em'}>
                      {actionLinks
                        .filter(
                          ({ requiredPermission }) =>
                            !requiredPermission ||
                            checkChapterPermission(user, requiredPermission, {
                              chapterId: chapter.id,
                            }),
                        )
                        .map(({ colorScheme, size, href, text }) => (
                          <LinkButton
                            key={text}
                            colorScheme={colorScheme}
                            size={size}
                            href={href(chapter.id)}
                          >
                            {text}
                            <Text srOnly as="span">
                              {text !== 'Edit'
                                ? `for ${chapter.name}`
                                : `${chapter.name}`}
                            </Text>
                          </LinkButton>
                        ))}
                    </HStack>
                  </VStack>
                ),
              }}
            />
          </Flex>
        ))}
      </Box>
    </VStack>
  );
};

ChaptersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
