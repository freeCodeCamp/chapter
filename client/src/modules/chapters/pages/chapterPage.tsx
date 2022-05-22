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
  useChapterSubscribeMutation,
} from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const ChapterPage: NextPage = () => {
  const id = useParam('chapterId');
  const { user } = useAuth();

  const { loading, error, data } = useChapterQuery({
    variables: { id: id || -1 },
  });

  const confirm = useConfirm();
  const toast = useToast();

  const [joinChapterFn] = useJoinChapterMutation({
    refetchQueries: [{ query: CHAPTER_USER, variables: { chapterId: id } }],
  });

  const [chapterSubscribeFn] = useChapterSubscribeMutation({
    refetchQueries: [{ query: CHAPTER_USER, variables: { chapterId: id } }],
  });

  const { loading: loadingChapterUser, data: dataChapterUser } =
    useChapterUserQuery({
      variables: { chapterId: id },
    });

  const joinChapter = async () => {
    const ok = await confirm();
    if (ok) {
      try {
        await joinChapterFn({ variables: { chapterId: id } });
        toast({ title: 'You successfully joined chapter', status: 'success' });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const chapterSubscribe = async (subscribed: boolean) => {
    const ok = await confirm(
      subscribed
        ? {
            title: 'Unsubscribe from chapter?',
            body: 'Unsubscribing from chapter will affect subscriptions of all exising events, and new events in the chapter.',
          }
        : { title: 'Do you want to subscribe?' },
    );

    if (ok) {
      try {
        await chapterSubscribeFn({ variables: { chapterId: id } });
        toast(
          subscribed
            ? {
                title: 'You have unsubscribed from chapter',
                status: 'info',
              }
            : {
                title: 'You successfully subscribed to chapter',
                status: 'success',
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
                  onClick={() => chapterSubscribe(true)}
                  size="md"
                >
                  Unsubscribe
                </Button>
              ) : (
                <Button
                  colorScheme="green"
                  onClick={() => chapterSubscribe(false)}
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
              chapter: { id, name: data.chapter?.name || '' },
            }}
          />
        ))}
      </Stack>
    </VStack>
  );
};
