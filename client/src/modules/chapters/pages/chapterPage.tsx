import {
  Heading,
  VStack,
  HStack,
  Spinner,
  Stack,
  Text,
  Image,
  Link,
  Button,
  useToast,
  Tag,
  Flex,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';
import React from 'react';

import { useConfirm } from 'chakra-confirm';
import { CHAPTER_USER } from '../graphql/queries';
import { useAuth } from '../../auth/store';
import { EventCard } from 'components/EventCard';
import {
  useChapterQuery,
  useChapterUserQuery,
  useJoinChapterMutation,
  useToggleChapterSubscriptionMutation,
} from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const ChapterPage: NextPage = () => {
  const chapterId = useParam('chapterId');
  const { user } = useAuth();

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  const confirm = useConfirm();
  const toast = useToast();

  const { loading: loadingChapterUser, data: dataChapterUser } =
    useChapterUserQuery({
      variables: { chapterId },
    });

  const refetch = {
    refetchQueries: [{ query: CHAPTER_USER, variables: { chapterId } }],
  };
  const [joinChapterFn] = useJoinChapterMutation(refetch);
  const [chapterSubscribeFn] = useToggleChapterSubscriptionMutation(refetch);

  const joinChapter = async () => {
    const ok = await confirm();
    if (ok) {
      try {
        await joinChapterFn({ variables: { chapterId } });
        toast({ title: 'You successfully joined chapter', status: 'success' });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const chapterSubscribe = async (toSubscribe: boolean) => {
    const ok = await confirm(
      toSubscribe
        ? { title: 'Do you want to subscribe?' }
        : {
            title: 'Unsubscribe from chapter?',
            body: 'Unsubscribing from this chapter will affect subscriptions of all existing events, and new events in the chapter.',
          },
    );

    if (ok) {
      try {
        await chapterSubscribeFn({ variables: { chapterId } });
        toast(
          toSubscribe
            ? {
                title: 'You successfully subscribed to this chapter',
                status: 'success',
              }
            : {
                title: 'You have unsubscribed from this chapter',
                status: 'info',
              },
        );
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error || !data?.chapter) {
    return (
      <div>
        <h1>error...</h1>
        <h2>{error?.message}</h2>
      </div>
    );
  }

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Image
          boxSize="100%"
          maxH="300px"
          src={data.chapter.imageUrl}
          alt=""
          borderRadius="md"
          objectFit="cover"
        />
        <Heading
          as="h1"
          lineHeight={1.1}
          fontWeight={600}
          color={'gray.700'}
          fontSize={{ base: 'xl', sm: '4xl', lg: '3xl' }}
        >
          <Text as={'span'} position={'relative'}>
            {data.chapter.name}
          </Text>
          <br />
        </Heading>
        <Text fontSize={'lg'} color={'gray.500'}>
          {data.chapter.description}
        </Text>
        <Flex alignItems="baseline" pt={3}>
          <Tag
            borderRadius="full"
            pl="2"
            px="2"
            colorScheme="teal"
            key={data.chapter.tags}
            mr="2"
          >
            {data.chapter.tags}
          </Tag>
        </Flex>
        {user &&
          (loadingChapterUser ? (
            <Spinner />
          ) : dataChapterUser ? (
            <HStack>
              <CheckIcon />
              <Text>
                {dataChapterUser.chapterUser.chapter_role.name} of the chapter
              </Text>
              {dataChapterUser.chapterUser.subscribed ? (
                <Button
                  colorScheme="orange"
                  onClick={() => chapterSubscribe(false)}
                  size="md"
                >
                  Unsubscribe
                </Button>
              ) : (
                <Button
                  colorScheme="green"
                  onClick={() => chapterSubscribe(true)}
                  size="md"
                >
                  Subscribe
                </Button>
              )}
            </HStack>
          ) : (
            <Button colorScheme="blue" onClick={joinChapter}>
              Join chapter
            </Button>
          ))}
        {data.chapter.chatUrl && (
          <div>
            <Heading size="md" color={'gray.700'}>
              Chat Link:
            </Heading>
            <Link>{data.chapter.chatUrl}</Link>
          </div>
        )}
        <Heading size="md" color={'gray.700'}>
          Events:
        </Heading>
        {data.chapter.events.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              // Fix this | undefined
              chapter: { id: chapterId, name: data.chapter?.name || '' },
            }}
          />
        ))}
      </Stack>
    </VStack>
  );
};
