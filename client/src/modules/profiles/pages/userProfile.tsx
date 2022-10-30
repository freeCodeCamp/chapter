import React, { useState } from 'react';
import { Flex, Heading, Link, Text } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
} from '../../../generated/graphql';
import { meQuery } from '../../auth/graphql/queries';
import { useAuth } from '../../auth/store';
import { ProfileForm } from '../component/ProfileForm';
import { useLogout } from 'hooks/useAuth';

export const UserProfilePage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const { user } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  const confirmDelete = useConfirmDelete({
    body: 'Are you sure you want to delete your account? Account deletion cannot be reversed.',
    buttonText: 'Delete account',
  });
  const [deleteMe] = useDeleteMeMutation();
  const [updateMe] = useUpdateMeMutation({
    refetchQueries: [{ query: meQuery }],
  });

  const submitUpdateMe = async (data: UpdateUserInputs) => {
    const name = data.name?.trim();
    const image_url = data.image_url;
    setLoadingUpdate(true);
    try {
      await updateMe({
        variables: {
          data: { name, auto_subscribe: data.auto_subscribe, image_url },
        },
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
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
