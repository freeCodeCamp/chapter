import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { useConfirm, useConfirmDelete } from 'chakra-confirm';
import { DataTable } from 'chakra-data-table';

import { DASHBOARD_EVENT } from '../graphql/queries';
import {
  MutationConfirmAttendeeArgs,
  MutationDeleteAttendeeArgs,
  MutationMoveAttendeeToWaitlistArgs,
  useConfirmAttendeeMutation,
  useDeleteAttendeeMutation,
  useMoveAttendeeToWaitlistMutation,
} from '../../../../generated/graphql';
import { EVENT } from '../../../events/graphql/queries';
import { AttendanceNames } from '../../../../../../common/attendance';
import UserName from '../../../../components/UserName';

const args = (eventId: number) => ({
  refetchQueries: [
    { query: EVENT, variables: { eventId } },
    { query: DASHBOARD_EVENT, variables: { eventId } },
  ],
});

interface EventUsersProps {
  event: {
    event_users: {
      attendance: { name: string };
      event_role: { name: string };
      joined_date: string;
      user: { id: number; name: string };
    }[];
    id: number;
  };
}

export const EventUsers = ({
  event: { event_users, id: eventId },
}: EventUsersProps) => {
  const [confirmAttendee] = useConfirmAttendeeMutation(args(eventId));
  const [moveAttendeeToWaitlist] = useMoveAttendeeToWaitlistMutation(
    args(eventId),
  );
  const [removeAttendee] = useDeleteAttendeeMutation(args(eventId));

  const confirm = useConfirm();
  const confirmDelete = useConfirmDelete();

  const onConfirmAttendee =
    ({ eventId, userId }: MutationConfirmAttendeeArgs) =>
    async () => {
      const ok = await confirm({
        title: 'Confirm attendee?',
        body: 'Are you sure you want to confirm the attendee?',
        buttonText: 'Confirm user',
      });
      if (ok) confirmAttendee({ variables: { eventId, userId } });
    };

  const onRemove =
    ({ eventId, userId }: MutationDeleteAttendeeArgs) =>
    async () => {
      const ok = await confirmDelete({
        buttonText: 'Remove user',
        body: 'Are you sure you want to remove this user from the event?',
        title: 'Remove user from event?',
      });
      if (ok) removeAttendee({ variables: { eventId, userId } });
    };

  const onMoveToWaitlist =
    ({ eventId, userId }: MutationMoveAttendeeToWaitlistArgs) =>
    async () => {
      const ok = await confirm({
        body: 'Are you sure you want to move the user to the waitlist?',
        buttonColor: 'orange',
        buttonText: 'Move user',
        title: 'Move user to waitlist?',
      });
      if (ok) moveAttendeeToWaitlist({ variables: { eventId, userId } });
    };

  const userLists = [
    {
      title: 'Attendees',
      statusFilter: AttendanceNames.confirmed,
      action: [
        { title: 'Remove', onClick: onRemove, colorScheme: 'red' },
        {
          title: 'Move to waitlist',
          onClick: onMoveToWaitlist,
          colorScheme: 'orange',
        },
      ],
    },
    {
      title: 'Waitlist',
      statusFilter: AttendanceNames.waitlist,
      action: [
        { title: 'Confirm', onClick: onConfirmAttendee, colorScheme: 'blue' },
      ],
    },
    {
      title: 'Canceled',
      statusFilter: AttendanceNames.canceled,
      action: [{ title: 'Remove', onClick: onRemove, colorScheme: 'red' }],
    },
  ];

  return (
    <Box p="2" borderWidth="1px" borderRadius="lg" mt="2">
      {userLists.map(({ title, statusFilter, action }) => {
        const users =
          event_users.filter(
            ({ attendance }) => attendance.name === statusFilter,
          ) ?? [];
        return (
          <Fragment key={title.toLowerCase()}>
            <Box
              display={{ base: 'none', lg: 'block' }}
              width="100%"
              data-cy={title.toLowerCase()}
            >
              <DataTable
                title={`${title}: ${users.length}`}
                data={users}
                keys={['user', 'joined', 'role', 'action'] as const}
                emptyText="No users"
                mapper={{
                  user: ({ user }) => <UserName user={user} />,
                  action: ({ user }) => (
                    <HStack>
                      {action.map(({ title, onClick, colorScheme }) => (
                        <Button
                          key={title.toLowerCase()}
                          data-cy={title.toLowerCase()}
                          size="xs"
                          colorScheme={colorScheme}
                          onClick={onClick({ eventId, userId: user.id })}
                        >
                          {title}
                          <Text srOnly as="span">
                            {user.name} attendee
                          </Text>
                        </Button>
                      ))}
                    </HStack>
                  ),
                  role: ({ event_role }) => (
                    <Text data-cy="role">{event_role.name}</Text>
                  ),
                  joined: ({ joined_date }) => <Text>{joined_date}</Text>,
                }}
              />
            </Box>
            <Box display={{ base: 'block', lg: 'none' }} marginBlock={'2em'}>
              {users.map(
                ({ attendance, event_role, joined_date, user }, index) => (
                  // For a single event, each user can only have one event_user
                  // entry, so we can use the user id as the key.
                  <HStack key={user.id}>
                    <DataTable
                      title={
                        {
                          [AttendanceNames.confirmed]: 'Attendee',
                          [AttendanceNames.waitlist]: 'On waitlist',
                          [AttendanceNames.canceled]: 'Canceled',
                        }[attendance.name]
                      }
                      data={[users[index]]}
                      keys={['type', 'action'] as const}
                      showHeader={false}
                      emptyText="No users"
                      mapper={{
                        type: () => (
                          <VStack
                            align={'flex-start'}
                            fontSize={['sm', 'md']}
                            fontWeight={700}
                            spacing={'2'}
                            marginBottom={4}
                          >
                            <Text>User</Text>
                            <Text>Joined</Text>
                            <Text>Role</Text>
                            <Text>Actions</Text>
                          </VStack>
                        ),
                        action: () => (
                          <VStack
                            align={'flex-start'}
                            fontSize={['sm', 'md']}
                            spacing={'2'}
                            marginBottom={4}
                          >
                            <UserName user={user} />
                            <Text>{joined_date}</Text>
                            {action.map(({ title, onClick, colorScheme }) => (
                              <Button
                                key={title.toLowerCase()}
                                data-cy={title.toLowerCase()}
                                size="xs"
                                colorScheme={colorScheme}
                                onClick={onClick({
                                  eventId,
                                  userId: user.id,
                                })}
                              >
                                {title}
                                <Text srOnly as="span">
                                  {user.name} attendee
                                </Text>
                              </Button>
                            ))}
                            <Text data-cy="role">{event_role.name}</Text>
                          </VStack>
                        ),
                      }}
                    />
                  </HStack>
                ),
              )}
            </Box>
          </Fragment>
        );
      })}
    </Box>
  );
};
