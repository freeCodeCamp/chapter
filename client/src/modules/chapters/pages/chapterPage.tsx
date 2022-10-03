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
import NextError from 'next/error';
import React, { useEffect } from 'react';

import { useConfirm } from 'chakra-confirm';
import { CHAPTER_USER } from '../graphql/queries';
import { useAuth } from '../../auth/store';
import { Loading } from 'components/Loading';
import { EventCard } from 'components/EventCard';
import {
  useChapterLazyQuery,
  useChapterUserLazyQuery,
  useJoinChapterMutation,
  useLeaveChapterMutation,
  useToggleChapterSubscriptionMutation,
} from 'generated/graphql';
import { useParam } from 'hooks/useParam';

export const ChapterPage: NextPage = () => {
  const { param: chapterId, isReady } = useParam('chapterId');
  const { user } = useAuth();

  const [getChapter, { loading, error, data }] = useChapterLazyQuery({
    variables: { chapterId },
  });

  const confirm = useConfirm();
  const toast = useToast();

  const [
    getChapterUsers,
    { loading: loadingChapterUser, data: dataChapterUser },
  ] = useChapterUserLazyQuery({
    variables: { chapterId },
  });

  useEffect(() => {
    if (isReady) {
      getChapter();
      getChapterUsers();
    }
  }, [isReady]);

  const refetch = {
    refetchQueries: [{ query: CHAPTER_USER, variables: { chapterId } }],
  };
  const [joinChapterFn] = useJoinChapterMutation(refetch);
  const [leaveChapterFn] = useLeaveChapterMutation(refetch);
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

  const leaveChapter = async () => {
    const ok = await confirm();
    if (ok) {
      try {
        await leaveChapterFn({ variables: { chapterId } });
        toast({ title: 'You successfully left chapter', status: 'success' });
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

  const isLoading = loading || !isReady || !data;
  if (isLoading || error) return <Loading loading={isLoading} error={error} />;
  if (!data.chapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Image
          boxSize="100%"
          maxH="300px"
          src={data.chapter.image_url}
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
          ) : (
            dataChapterUser?.chapterUser && (
              <HStack>
                {dataChapterUser.chapterUser.subscribed ? (
                  <HStack justifyContent={'space-between'} width={'100%'}>
                    <Text fontWeight={500}>
                      Unfollow upcoming chapter&apos;s events
                    </Text>
                    <Button onClick={() => chapterSubscribe(false)} size="md">
                      Unsubscribe
                    </Button>
                  </HStack>
                ) : (
                  <HStack justifyContent={'space-between'} width={'100%'}>
                    <Text fontWeight={500}>
                      Follow upcoming chapter&apos;s events
                    </Text>
                    <Button
                      colorScheme="blue"
                      onClick={() => chapterSubscribe(true)}
                      size="md"
                    >
                      Subscribe
                    </Button>
                  </HStack>
                )}
              </HStack>
            )
          ))}

        {user &&
          (loadingChapterUser ? (
            <Spinner />
          ) : dataChapterUser?.chapterUser?.chapter_role ? (
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={500}>
                <CheckIcon marginRight={1} />
                {dataChapterUser.chapterUser.chapter_role.name} of the chapter
              </Text>
              <Button onClick={leaveChapter}>Leave</Button>
            </HStack>
          ) : (
            <HStack justifyContent="space-between">
              <Text fontWeight={500}>Become member of the chapter</Text>
              <Button colorScheme="blue" onClick={joinChapter}>
                Join
              </Button>
            </HStack>
          ))}

        {data.chapter.chat_url && (
          <div>
            <Heading size="md" color={'gray.700'}>
              Chat Link:
            </Heading>
            <Link>{data.chapter.chat_url}</Link>
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
