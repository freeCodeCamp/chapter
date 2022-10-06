import React, { useState } from 'react';
import { Flex, Heading, Text, Link } from '@chakra-ui/layout';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { LinkButton } from 'chakra-next-link';
import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
} from '../../../generated/graphql';
import { useAuthStore } from '../../auth/store';
import { ProfileForm } from '../component/ProfileForm';
import { meQuery } from 'modules/auth/graphql/queries';
import { useLogout } from 'hooks/useAuth';

export const UserProfilePage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
  const {
    data: { user },
  } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();

  const confirmDelete = useConfirmDelete({ doubleConfirm: true });
  const [deleteMe] = useDeleteMeMutation();
  const [updateMe] = useUpdateMeMutation({
    refetchQueries: [{ query: meQuery }],
  });

  const submitUpdateMe = async (data: UpdateUserInputs) => {
    const name = data.name?.trim();
    setLoadingUpdate(true);
    try {
      await updateMe({
        variables: { data: { name } },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

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

          <ProfileForm
            loading={loadingUpdate}
            onSubmit={submitUpdateMe}
            data={user}
            loadingText={'Saving Profile Changes'}
            submitText={'Save Profile Changes'}
          />

          <Button colorScheme={'red'} marginBlock={'2em'} onClick={clickDelete}>
            Delete My Data
          </Button>
          <LinkButton
            as="a"
            href={new URL('/authenticate-with-google', serverUrl).href}
            fontWeight="600"
            background={'gray.85'}
            color={'gray.10'}
            height={'100%'}
            marginLeft={'1em'}
            borderRadius={'5px'}
            paddingBlock={'.65em'}
            _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          >
            Authenticate with Google
          </LinkButton>
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
