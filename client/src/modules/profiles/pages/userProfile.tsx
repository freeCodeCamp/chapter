import React from 'react';
import { Flex, Heading, Text, Link } from '@chakra-ui/layout';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { useDeleteMeMutation } from '../../../generated/graphql';
import { useAuthStore } from '../../auth/store';
import { useLogout } from 'hooks/useAuth';

export const UserProfilePage = () => {
  const {
    data: { user },
  } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();

  const confirmDelete = useConfirmDelete({ doubleConfirm: true });
  const [deleteMe] = useDeleteMeMutation();
  const clickDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    await deleteMe();
    await logout();
    router.push('/');
  };

  return (
    <div>
      {user ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            Profile
          </Heading>
          <Heading as="h2" size={'lg'}>
            Welcome {user.name}
          </Heading>
          {user.admined_chapters.length > 0 && (
            <>
              <Heading as="h2" marginBlock={'.5em'} size="md">
                You are an administrator for these Chapters:
              </Heading>
              <Flex marginTop={'1em'} flexDirection={'column'} gap={4}>
                {user.admined_chapters.map(({ name, id }) => (
                  <Link key={id}>
                    <Text>{name}</Text>
                  </Link>
                ))}
              </Flex>
            </>
          )}

          <Button colorScheme={'red'} marginBlock={'2em'} onClick={clickDelete}>
            Delete My Data
          </Button>
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
