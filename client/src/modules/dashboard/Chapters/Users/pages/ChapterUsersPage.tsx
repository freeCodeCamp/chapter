import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { useChapterUsersQuery } from '../../../../../generated/graphql';
import { Layout } from '../../../shared/components/Layout';
import { getId } from '../../../../../util/getId';

export const ChapterUsersPage: NextPage = () => {
  const router = useRouter();

  const id = getId(router.query) || -1;

  const { loading, error, data } = useChapterUsersQuery({
    variables: { id },
  });

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="page-heading">Chapter Users</Heading>
        </Flex>
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.chapter?.chapter_users ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={data.chapter.chapter_users}
            tableProps={{ table: { 'aria-labelledby': 'page-heading' } }}
            keys={['name', 'email', 'role'] as const}
            mapper={{
              name: ({ user }) => user.name,
              email: ({ user }) => user.email,
              role: ({ chapter_role }) => chapter_role.name,
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
