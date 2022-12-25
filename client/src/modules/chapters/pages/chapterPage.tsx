import {
  Box,
  Button,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  VStack,
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
    <Text size="md">
      Chat Link:
      <Link>{chatUrl}</Link>
    </Text>
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
    <>
      <Text fontWeight={500}>Unfollow upcoming chapter&apos;s events</Text>
      <Button
        data-cy="unsubscribe-chapter"
        onClick={() => chapterSubscribe(false)}
      >
        Unsubscribe
      </Button>
    </>
  ) : (
    <>
      <Text fontWeight={500}>Follow upcoming chapter&apos;s events</Text>
      <Button
        colorScheme="blue"
        data-cy="subscribe-chapter"
        onClick={() => chapterSubscribe(true)}
      >
        Subscribe
      </Button>
    </>
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
}) =>
  chapterUser?.chapter_role ? (
    <>
      <Text data-cy="join-success" fontWeight={500}>
        <CheckIcon marginRight={1} />
        {chapterUser.chapter_role.name} of the chapter
      </Text>
      <Button onClick={LeaveChapter}>Leave</Button>
    </>
  ) : (
    <>
      <Text fontWeight={500}>Become member of the chapter</Text>
      <Button colorScheme="blue" onClick={JoinChapter}>
        Join
      </Button>
    </>
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
  const [chapterSubscribe] = useToggleChapterSubscriptionMutation(refetch);

  const onJoinChapter = async (options?: { invited?: boolean }) => {
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
        await joinChapter({ variables: { chapterId } });
        toast({ title: 'You successfully joined chapter', status: 'success' });
      } catch (err) {
        toast({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const onLeaveChapter = async () => {
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
    if (ok) {
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
    }
  };

  const onChapterSubscribe = async (toSubscribe: boolean) => {
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

    if (ok) {
      try {
        await chapterSubscribe({ variables: { chapterId } });
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
        onLeaveChapter();
      } else {
        onJoinChapter({ invited: true });
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
          fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
        >
          {data.chapter.name}
        </Heading>
        <Text fontSize={'lg'} color={'gray.500'}>
          {data.chapter.description}
        </Text>
        {isLoggedIn && dataChapterUser && (
          <SimpleGrid columns={2} gap={5} alignItems="center">
            <ChapterUserRoleWidget
              JoinChapter={onJoinChapter}
              LeaveChapter={onLeaveChapter}
              chapterUser={dataChapterUser.chapterUser}
            />
            {dataChapterUser.chapterUser && (
              <SubscriptionWidget
                chapterUser={dataChapterUser.chapterUser}
                chapterSubscribe={onChapterSubscribe}
              />
            )}
          </SimpleGrid>
        )}
        <ChatLink chatUrl={data.chapter.chat_url} />
        <Heading as="h2" fontSize={['md', 'lg', 'xl']}>
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
