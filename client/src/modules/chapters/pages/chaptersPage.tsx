import { Flex, Heading, Grid, Center } from '@chakra-ui/layout';
import { NextPage } from 'next';
import React from 'react';
import { LinkButton } from 'chakra-next-link';
import { ChapterCard } from '../../../components/ChapterCard';
import { useChaptersQuery } from '../../../generated/graphql';
import { Loading } from '../../../components/Loading';
import { useAuth } from '../../../modules/auth/store';
import { checkPermission } from '../../../util/check-permission';
import { Permission } from '../../../../../common/permissions';

export const ChaptersPage: NextPage = () => {
  const { loading, error, data } = useChaptersQuery();
  const { user } = useAuth();
  const isLoading = loading || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;

  return (
    <Center>
      <Grid
        gap="1em"
        w={{ base: '90%', '2xl': '60%' }}
        maxW="48em"
        mt={10}
        mb={5}
        placeItems={'center'}
      >
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          width={'100%'}
        >
          <Heading marginBlock={'1em'}>Chapters: </Heading>
          {checkPermission(user, Permission.ChaptersView) && (
            <LinkButton
              href="/dashboard/chapters"
              background="gray.85"
              color="gray.10"
              _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
              _focusVisible={{
                outlineColor: 'blue.600',
                outlineOffset: '1px',
                boxShadow: 'none',
              }}
            >
              Chapter Dashboard
            </LinkButton>
          )}
        </Flex>
        {data.chapters.map((chapter) => (
          <ChapterCard chapter={chapter} key={chapter.id} />
        ))}
      </Grid>
    </Center>
  );
};
