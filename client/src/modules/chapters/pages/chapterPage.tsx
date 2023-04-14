import {
  Box,
  Button,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useConfirm } from 'chakra-confirm';

import { CHAPTER } from '../graphql/queries';
import { useUser } from '../../auth/user';
import { InfoList } from '../../../components/InfoList';
import { useSubscribeCheckbox } from '../../../components/SubscribeCheckbox';
import { Loading } from '../../../components/Loading';
import { EventCard } from '../../../components/EventCard';
import { TagsBox } from '../../../components/TagsBox';
import {
  useJoinChapterMutation,
  useLeaveChapterMutation,
  useToggleChapterSubscriptionMutation,
  useChapterQuery,
} from '../../../generated/graphql';
import { useAlert } from '../../../hooks/useAlert';
import { useParam } from '../../../hooks/useParam';
import { EVENT } from '../../events/graphql/queries';
import { meQuery } from '../../auth/graphql/queries';
import { ChapterRoles } from '../../../../../common/roles';

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
  loading,
}: {
  chapterUser: { subscribed: boolean };
  chapterSubscribe: (toSubscribe: boolean) => Promise<void>;
  loading: boolean;
}) => {
  return chapterUser.subscribed ? (
    <>
      <Text fontWeight={500}>You are subscribed to new events</Text>
      <Button
        data-cy="unsubscribe-chapter"
        isLoading={loading}
        onClick={() => chapterSubscribe(false)}
      >
        Unsubscribe
      </Button>
    </>
  ) : (
    <>
      <Text fontWeight={500}>Not subscribed to new events</Text>
      <Button
        colorScheme="blue"
        data-cy="subscribe-chapter"
        isLoading={loading}
        onClick={() => chapterSubscribe(true)}
      >
        Subscribe
      </Button>
    </>
  );
};

const ChapterUserRoleWidget = ({
  chapterUser,
  JoinChapter,
  LeaveChapter,
  loadingJoin,
  loadingLeave,
}: {
  chapterUser: { chapter_role: { name: string } } | undefined;
  JoinChapter: () => Promise<void>;
  LeaveChapter: () => Promise<void>;
  loadingJoin: boolean;
  loadingLeave: boolean;
}) =>
  chapterUser?.chapter_role ? (
    <>
      <Text data-cy="join-success" fontWeight={500}>
        <CheckIcon marginRight={1} />
        {chapterUser.chapter_role.name} of the chapter
      </Text>
      <Button isLoading={loadingLeave} onClick={LeaveChapter}>
        Leave Chapter
      </Button>
    </>
  ) : (
    <Button colorScheme="blue" isLoading={loadingJoin} onClick={JoinChapter}>
      Join Chapter
    </Button>
  );

export const ChapterPage: NextPage = () => {
  const { param: chapterId } = useParam('chapterId');
  const router = useRouter();
  const { isLoggedIn, user } = useUser();

  const { loading, error, data } = useChapterQuery({
    variables: { chapterId },
  });

  const confirm = useConfirm();
  const [hasShownModal, setHasShownModal] = useState(false);
  const addAlert = useAlert();

  const chapterUser = user?.user_chapters.find(
    ({ chapter_id }) => chapter_id === chapterId,
  );

  const refetch = {
    refetchQueries: [
      { query: meQuery },
      { query: CHAPTER, variables: { chapterId } },
    ],
  };
  const [joinChapter, { loading: loadingJoin }] =
    useJoinChapterMutation(refetch);
  const [leaveChapter, { loading: loadingLeave }] = useLeaveChapterMutation();
  const [chapterSubscribe, { loading: loadingSubscribeToggle }] =
    useToggleChapterSubscriptionMutation(refetch);
  const { getSubscribe, SubscribeCheckbox } = useSubscribeCheckbox(
    !!user?.auto_subscribe,
  );

  const onJoinChapter = async (options?: { invited?: boolean }) => {
    const confirmOptions = options?.invited
      ? {
          title: 'You have been invited to this chapter',
          body: (
            <>
              Would you like to join?
              <SubscribeCheckbox label="Send me notifications about new events" />
            </>
          ),
        }
      : {
          title: 'Join this chapter?',
          body: (
            <>
              Joining chapter will add you as a member to chapter.
              <SubscribeCheckbox label="Send me notifications about new events" />
            </>
          ),
        };
    const ok = await confirm(confirmOptions);
    if (ok) {
      try {
        await joinChapter({
          variables: { chapterId, subscribe: getSubscribe() },
        });
        addAlert({
          title: 'You successfully joined this chapter',
          status: 'success',
        });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
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
          {chapterUser?.chapter_role.name === ChapterRoles.administrator && (
            <>
              <br />
              <br />
              Warning: if you rejoin you will no longer be an administrator.
            </>
          )}
        </>
      ),
    });
    if (ok) {
      try {
        await leaveChapter({
          variables: { chapterId },
          refetchQueries: [
            ...refetch.refetchQueries,
            ...(data?.chapter.events.map(({ id }) => ({
              query: EVENT,
              variables: { eventId: id },
            })) ?? []),
            { query: meQuery },
          ],
        });
        addAlert({
          title: 'You successfully left the chapter',
          status: 'success',
        });
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
        console.error(err);
      }
    }
  };

  const onChapterSubscribe = async (toSubscribe: boolean) => {
    const ok = await confirm(
      toSubscribe
        ? {
            title: 'Subscribe to new events in the chapter?',
            body: (
              <InfoList
                items={[
                  'You will receive emails about new events in the chapter.',
                  'This does not affect notifications from Google Calendar.',
                ]}
              />
            ),
          }
        : {
            title: 'Unsubscribe from new events in the chapter?',
            body: (
              <InfoList
                items={[
                  'You will no longer receive emails about new events in the chapter. ',
                  'This does not affect notifications from Google Calendar.',
                ]}
              />
            ),
          },
    );

    if (ok) {
      try {
        await chapterSubscribe({ variables: { chapterId } });
        addAlert(
          toSubscribe
            ? {
                title:
                  'You successfully subscribed to new events in the chapter',
                status: 'success',
              }
            : {
                title: 'You have unsubscribed from new events in this chapter',
                status: 'success',
              },
        );
      } catch (err) {
        addAlert({ title: 'Something went wrong', status: 'error' });
      }
    }
  };

  const isLoading = loading || !data;

  const canShowConfirmModal =
    router.query?.ask_to_confirm && !isLoading && isLoggedIn;
  const isAlreadyMember = !!chapterUser;

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

  if (isLoading || error) return <Loading error={error} />;
  if (!data.chapter)
    return <NextError statusCode={404} title="Chapter not found" />;

  return (
    <VStack>
      <Stack w={['90%', '90%', '60%']} maxW="600px" spacing={6} mt={10} mb={5}>
        {data.chapter.logo_url && (
          <Image
            src={data.chapter.logo_url}
            alt={`${data.chapter.name} logo`}
            position={`${data.chapter.banner_url ? 'absolute' : 'initial'}`}
            width="6em"
            height="6em"
            borderRadius="50%"
            outline="2px solid white"
          />
        )}
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
        {!!data.chapter.chapter_tags.length && (
          <TagsBox tags={data.chapter.chapter_tags} />
        )}
        <Text fontSize={'lg'} color={'gray.500'}>
          {data.chapter.description}
        </Text>
        {isLoggedIn && user && (
          <SimpleGrid columns={2} gap={5} alignItems="center">
            <ChapterUserRoleWidget
              chapterUser={chapterUser}
              JoinChapter={onJoinChapter}
              LeaveChapter={onLeaveChapter}
              loadingJoin={loadingJoin}
              loadingLeave={loadingLeave}
            />
            {chapterUser && (
              <SubscriptionWidget
                chapterUser={chapterUser}
                chapterSubscribe={onChapterSubscribe}
                loading={loadingSubscribeToggle}
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
