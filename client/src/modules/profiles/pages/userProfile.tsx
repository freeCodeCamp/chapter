import React from 'react';
import { Flex, Heading, useToast } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { Link, LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
} from '../../../generated/graphql';
import { getNameText } from '../../../components/UserName';
import { meQuery } from '../../auth/graphql/queries';
import { useAuth } from '../../auth/store';
import { ProfileForm } from '../component/ProfileForm';
import { useLogout } from '../../../hooks/useAuth';
import { checkPermission } from '../../../util/check-permission';
import { Permission } from '../../../../../common/permissions';

export const UserProfilePage = () => {
  const { user } = useAuth();
  const logout = useLogout();
  const router = useRouter();
  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
  const canAuthenticateWithGoogle = checkPermission(
    user,
    Permission.GoogleAuthenticate,
  );

  const confirmDelete = useConfirmDelete({
    body: 'Are you sure you want to delete your account? Account deletion cannot be reversed.',
    buttonText: 'Delete account',
  });
  const [deleteMe] = useDeleteMeMutation();
  const [updateMe] = useUpdateMeMutation({
    refetchQueries: [{ query: meQuery }],
  });

  const toast = useToast();

  const submitUpdateMe = async (data: UpdateUserInputs) => {
    const name = data.name?.trim();
    const image_url = data.image_url;
    const { data: userData, errors } = await updateMe({
      variables: {
        data: { name, auto_subscribe: data.auto_subscribe, image_url },
      },
    });
    if (errors) throw errors;
    if (userData) {
      toast({ title: 'Profile saved!', status: 'success' });
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
            Welcome {getNameText(user.name)}
          </Heading>
          {user.admined_chapters.length > 0 && (
            <>
              <Heading as="h2" marginBlock={'.5em'} size="md">
                You are an administrator for these Chapters:
              </Heading>
              <Flex marginTop={'1em'} flexDirection={'column'} gap={4}>
                {user.admined_chapters.map(({ name, id }) => (
                  <Link key={id} href={`/chapters/${id}`}>
                    {name}
                  </Link>
                ))}
              </Flex>
            </>
          )}

          <ProfileForm
            onSubmit={submitUpdateMe}
            data={user}
            loadingText={'Saving Profile Changes'}
            submitText={'Save Profile Changes'}
          />
          <Button colorScheme={'red'} marginBlock={'2em'} onClick={clickDelete}>
            Delete My Data
          </Button>
          {canAuthenticateWithGoogle && (
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
          )}
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
