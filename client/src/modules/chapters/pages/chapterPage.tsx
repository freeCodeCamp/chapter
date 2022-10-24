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
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useConfirm } from 'chakra-confirm';
import { CHAPTER_USER } from '../graphql/queries';
import { useAuth } from '../../auth/store';
import { Loading } from 'components/Loading';
import { EventCard } from 'components/EventCard';
import {
  useJoinChapterMutation,
  useLeaveChapterMutation,
  useToggleChapterSubscriptionMutation,
  ChapterUserQuery,
  useChapterQuery,
  useChapterUserQuery,
} from 'generated/graphql';
import { useParam } from 'hooks/useParam';

const ChatLink = ({ chatUrl }: { chatUrl?: string | null }) => {
  return chatUrl ? (
    <div>
      <Heading size="md" color={'gray.700'}>
        Chat Link:
      </Heading>
      <Link>{chatUrl}</Link>
    </div>
  ) : null;
};

const SubscriptionWidget = ({
  chapterUser,
  chapterSubscribe,
}: {
  chapterUser: ChapterUserQuery['chapterUser'];
  chapterSubscribe: (toSubscribe: boolean) => Promise<void>;
}) => {
  return chapterUser?.subscribed ? (
    <HStack justifyContent={'space-between'} width={'100%'}>
      <Text fontWeight={500}>Unfollow upcoming chapter&apos;s events</Text>
      <Button onClick={() => chapterSubscribe(false)} size="md">
        Unsubscribe
      </Button>
    </HStack>
  ) : (
    <HStack justifyContent={'space-between'} width={'100%'}>
      <Text fontWeight={500}>Follow upcoming chapter&apos;s events</Text>
      <Button
        colorScheme="blue"
        onClick={() => chapterSubscribe(true)}
        size="md"
      >
        Subscribe
      </Button>
    </HStack>
  );
};

const ChapterUserRoleWidget = ({
  chapterUser,
  LeaveChapter,
  JoinChapter,
}: {
  chapterUser: ChapterUserQuery['chapterUser'];
  LeaveChapter: () => Promise<void>;
  JoinChapter: () => Promise<void>;
}) => {
  return chapterUser?.chapter_role ? (
    <HStack justifyContent={'space-between'}>
      <Text data-cy="join-success" fontWeight={500}>
        <CheckIcon marginRight={1} />
        {chapterUser.chapter_role.name} of the chapter
      </Text>
      <Button onClick={LeaveChapter}>Leave</Button>
    </HStack>
  ) : (
    <HStack justifyContent="space-between">
      <Text fontWeight={500}>Become member of the chapter</Text>
      <Button colorScheme="blue" onClick={JoinChapter}>
        Join
      </Button>
    </HStack>
  );
};

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('chapterId');
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  const confirm = useConfirm();
  const [hasShownModal, setHasShownModal] = React.useState(false);
  const toast = useToast();

  const { loading: loadingChapterUser, data: dataChapterUser } =
    useChapterUserQuery({
      variables: { chapterId },
    });

  const refetch = {
    refetchQueries: [{ query: CHAPTER_USER, variables: { chapterId } }],
  };
  const [joinChapterFn] = useJoinChapterMutation(refetch);
  const [leaveChapterFn] = useLeaveChapterMutation(refetch);
  const [chapterSubscribeFn] = useToggleChapterSubscriptionMutation(refetch);

  const joinChapter = async (options?: { invited?: boolean }) => {
    const confirmOptions = options?.invited
      ? {
          title: 'You have been invited to this chapter',
          body: 'Would you like to join?',
        }
      : {
          title: 'Join this chapter?',
          body: 'Joining chapter will add you as a member to chapter.',
        };
    const ok = await confirm(confirmOptions);
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
    const ok = await confirm({
      title: 'Are you sure you want to leave this chapter?',
      body: "Leaving will cancel your attendance at all of this chapter's events.",
    });
    if (ok) {
      try {
        await leaveChapterFn({ variables: { chapterId } });
        toast({
          title: 'You successfully left the chapter',
          status: 'success',
        });
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
                status: 'success',
              },
        );
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
      }
    }
  };

  const isLoading = loading || loadingChapterUser || !data;

  const canShowConfirmModal =
    router.query?.ask_to_confirm && !isLoading && isLoggedIn;
  const isAlreadyMember = !!dataChapterUser?.chapterUser;

  useEffect(() => {
    if (canShowConfirmModal && !hasShownModal) {
      if (isAlreadyMember) {
        leaveChapter();
      } else {
        joinChapter({ invited: true });
      }
      setHasShownModal(true);
    }
  }, [canShowConfirmModal, isAlreadyMember, hasShownModal]);

  if (isLoading || error) return <Loading loading={isLoading} error={error} />;
  if (!data.chapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        <Image
          boxSize="100%"
          maxH="300px"
          src={data.chapter.banner_url}
          alt=""
          borderRadius="md"
          objectFit="cover"
          fallbackSrc="https://cdn.freecodecamp.org/chapter/puppy-small.jpg"
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
        {isLoggedIn &&
          (loadingChapterUser ? (
            <Spinner />
          ) : (
            dataChapterUser && (
              <ChapterUserRoleWidget
                JoinChapter={joinChapter}
                LeaveChapter={leaveChapter}
                chapterUser={dataChapterUser.chapterUser}
              />
            )
          ))}
        {isLoggedIn &&
          (loadingChapterUser ? (
            <Spinner />
          ) : (
            dataChapterUser?.chapterUser && (
              <SubscriptionWidget
                chapterUser={dataChapterUser.chapterUser}
                chapterSubscribe={chapterSubscribe}
              />
            )
          ))}

        <ChatLink chatUrl={data.chapter.chat_url} />
        <Heading size="md" color={'gray.700'}>
          Events:
        </Heading>
        {data.chapter.events.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              chapter: { id: chapterId, name: data.chapter.name },
            }}
          />
        ))}
      </Stack>
    </VStack>
  );
};
