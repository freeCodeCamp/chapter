import React from 'react';
import { Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import { Link } from 'chakra-next-link';
import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
  useUserProfileQuery,
} from '../../../generated/graphql';
import { getNameText } from '../../../components/UserName';
import { userProfileQuery } from '../graphql/queries';
import { ProfileForm } from '../component/ProfileForm';
import { useLogout } from 'hooks/useAuth';

export const UserProfilePage = () => {
  const { data } = useUserProfileQuery();
  const logout = useLogout();
  const router = useRouter();

  const confirmDelete = useConfirmDelete({
    body: 'Are you sure you want to delete your account? Account deletion cannot be reversed.',
    buttonText: 'Delete account',
  });
  const [deleteMe] = useDeleteMeMutation();
  const [updateMe] = useUpdateMeMutation({
    refetchQueries: [{ query: userProfileQuery }],
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
      {data ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            Profile
          </Heading>
          <Heading as="h2" size={'lg'}>
            Welcome, {getNameText(data.userInformation?.name)}
          </Heading>
          {data.userInformation?.admined_chapters.length > 0 && (
            <>
              <Heading as="h2" marginBlock={'.5em'} size="md">
                You are an administrator for these Chapters:
              </Heading>
              <Flex marginTop={'1em'} flexDirection={'column'} gap={4}>
                {data.userInformation?.admined_chapters.map(({ name, id }) => (
                  <Link key={id} href={`/chapters/${id}`}>
                    {name}
                  </Link>
                ))}
              </Flex>
            </>
          )}
          <Heading as="h2" marginTop={'2em'} size="lg" fontWeight={500}>
            Email address:{' '}
            <Text as="span" fontWeight={700}>
              {data.userInformation?.email}
            </Text>
          </Heading>
          <ProfileForm
            onSubmit={submitUpdateMe}
            data={data.userInformation}
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
