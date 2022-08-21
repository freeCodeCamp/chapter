import { Heading, Link, Box, HStack, Flex, Text } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { NextPage } from 'next';
import React from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useChapterQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('id');

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  console.log(chapterId);
  if (loading || error || !data?.chapter) {
    return (
      <Layout>
        <h1>{loading ? 'Loading...' : 'Error...'}</h1>
        {error && <div className={styles.error}>{error.message}</div>}
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className={styles.card}>
        <ProgressCardContent loading={loading}>
          <Heading
            fontSize={'md'}
            as="h1"
            fontWeight="semibold"
            marginBlock={'2'}
          >
            {data.chapter.name}
          </Heading>
          <Box>
            <Link
              href={`${chapterId}/users`}
              target="_blank"
              paddingBlock={'2'}
            >
              Chapter Users
            </Link>
          </Box>
          <HStack mt={'2'}>
            <LinkButton
              background={'gray.85'}
              _hover={{
                background: 'gray.45',
                color: 'gray.85',
              }}
              color={'gray.05'}
              size="sm"
              href={`${chapterId}/new-event`}
            >
              Add new event
            </LinkButton>
            <LinkButton
              background={'gray.85'}
              color={'gray.05'}
              _hover={{
                background: 'gray.45',
                color: 'gray.85',
              }}
              data-cy="create-venue"
              size="sm"
              href={`${chapterId}/new-venue`}
            >
              Add new venue
            </LinkButton>
          </HStack>
        </ProgressCardContent>
      </Card>

      {data.chapter.events.map(({ id, name, start_at }) => (
        <Link key={id} href={`/events/${id}`} _hover={{}}>
          <Flex
            paddingInline={'1em'}
            paddingBlock={'.5em'}
            justifyContent={'space-between'}
            flexDirection={['column', 'row']}
          >
            <Text
              as={'h2'}
              mt="2"
              fontWeight={600}
              fontSize={'md'}
              maxW={'10em'}
            >
              {name}
            </Text>
            <Text mt="2" fontWeight={400} fontSize={'md'} opacity={'.8'}>
              {start_at}
            </Text>
          </Flex>
        </Link>
      ))}
    </Layout>
  );
};
