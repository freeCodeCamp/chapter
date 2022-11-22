import {
  Heading,
  VStack,
  HStack,
  Spinner,
  Stack,
  Box,
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

// TODO: split this into two components and convert the toggle request to two
// separate requests (one for subscribe and one for unsubscribe)
const SubscriptionWidget = ({
  chapterUser,
  subscribeToChapter,
}: {
  chapterUser: ChapterUserQuery['chapterUser'];
  subscribeToChapter: (toSubscribe: boolean) => Promise<void>;
}) => {
  return chapterUser?.subscribed ? (
    <HStack justifyContent={'space-between'} width={'100%'}>
      <Text fontWeight={500}>Unfollow upcoming chapter&apos;s events</Text>
      <Button onClick={() => subscribeToChapter(false)} size="md">
        Unsubscribe
      </Button>
    </HStack>
  ) : (
    <HStack justifyContent={'space-between'} width={'100%'}>
      <Text fontWeight={500}>Follow upcoming chapter&apos;s events</Text>
      <Button
        colorScheme="blue"
        onClick={() => subscribeToChapter(true)}
        size="md"
      >
        Subscribe
      </Button>
    </HStack>
  );
};

const LeaveChapterWidget = ({
  onClick,
  name,
}: {
  onClick: () => Promise<void>;
  name: string;
}) => (
  <HStack justifyContent={'space-between'}>
    <Text data-cy="join-success" fontWeight={500}>
      <CheckIcon marginRight={1} />
      {name} of the chapter
    </Text>
    <Button onClick={onClick}>Leave</Button>
  </HStack>
);

const JoinChapterWidget = ({ onClick }: { onClick: () => Promise<void> }) => (
  <HStack justifyContent="space-between">
    <Text fontWeight={500}>Become member of the chapter</Text>
    <Button colorScheme="blue" onClick={onClick}>
      Join
    </Button>
  </HStack>
);

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
  const [joinChapter] = useJoinChapterMutation(refetch);
  const [leaveChapter] = useLeaveChapterMutation(refetch);
  const [toggleChapterSubscription] =
    useToggleChapterSubscriptionMutation(refetch);

  const tryToJoinChapter = async () => {
    try {
      await joinChapter({ variables: { chapterId } });
      toast({ title: 'You successfully joined chapter', status: 'success' });
    } catch (err) {
      toast({ title: 'Something went wrong', status: 'error' });
      console.error(err);
    }
  };
  const handleJoinInvitation = async () => {
    const ok = await confirm({
      title: 'You have been invited to this chapter',
      body: 'Would you like to join?',
    });
    if (ok) tryToJoinChapter();
  };

  const handleJoinRequest = async () => {
    const ok = await confirm({
      title: 'Join this chapter?',
      body: 'Joining chapter will add you as a member to chapter.',
    });
    if (ok) tryToJoinChapter();
  };

  const tryToLeaveChapter = async () => {
    try {
      await leaveChapter({ variables: { chapterId } });
      toast({
        title: 'You successfully left the chapter',
        status: 'success',
      });
    } catch (err) {
      toast({ title: 'Something went wrong', status: 'error' });
      console.error(err);
    }
  };

  const handleLeaveRequest = async () => {
    const ok = await confirm({
      title: 'Are you sure you want to leave this chapter?',
      body: (
        <>
          Leaving will cancel your attendance at all of this chapter&apos;s
          events.
          {dataChapterUser?.chapterUser?.chapter_role.name ===
            'administrator' && (
            <>
              <br />
              <br />
              Note: This will remove record of your chapter role as well.
              Joining chapter again will give you member role.
            </>
          )}
        </>
      ),
    });
    if (ok) tryToLeaveChapter();
  };

  const tryToToggleSubscription = async (toSubscribe: boolean) => {
    try {
      await toggleChapterSubscription({ variables: { chapterId } });
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
  };

  const handleSubscriptionToggleRequest = async (toSubscribe: boolean) => {
    const ok = await confirm(
      toSubscribe
        ? {
            title: 'Do you want to subscribe?',
            body: 'After subscribing you will receive emails about new events in this chapter.',
          }
        : {
            title: 'Unsubscribe from chapter?',
            body: 'After unsubscribing you will not receive emails about new events in this chapter.',
          },
    );

    if (ok) tryToToggleSubscription(toSubscribe);
  };

  const isLoading = loading || loadingChapterUser || !data;

  const canShowConfirmModal =
    router.query?.ask_to_confirm && !isLoading && isLoggedIn;
  const isAlreadyMember = !!dataChapterUser?.chapterUser;

  useEffect(() => {
    if (canShowConfirmModal && !hasShownModal) {
      if (isAlreadyMember) {
        handleLeaveRequest();
      } else {
        handleJoinInvitation();
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
        {data.chapter.banner_url && (
          <Box height={'300px'}>
            <Image
              boxSize="100%"
              maxH="300px"
              src={data.chapter.banner_url}
              alt=""
              borderRadius="md"
              objectFit="cover"
              fallbackSrc="https://cdn.freecodecamp.org/chapter/orange-graphics-small.jpg"
              fallbackStrategy="onError"
            />
          </Box>
        )}
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
            dataChapterUser &&
            (dataChapterUser.chapterUser?.chapter_role ? (
              <LeaveChapterWidget
                onClick={handleLeaveRequest}
                name={dataChapterUser.chapterUser.chapter_role.name}
              />
            ) : (
              <JoinChapterWidget onClick={handleJoinRequest} />
            ))
          ))}
        {isLoggedIn &&
          (loadingChapterUser ? (
            <Spinner />
          ) : (
            dataChapterUser?.chapterUser && (
              <SubscriptionWidget
                chapterUser={dataChapterUser.chapterUser}
                subscribeToChapter={handleSubscriptionToggleRequest}
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
