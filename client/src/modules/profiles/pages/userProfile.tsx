import { useApolloClient } from '@apollo/client';
import React from 'react';
import { Flex, Heading, Spinner, Text, useToast } from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';

import { Link } from 'chakra-next-link';
import {
  useDeleteMeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
  useUserProfileQuery,
  useUserDownloadLazyQuery,
  UserDownloadQuery,
} from '../../../generated/graphql';
import { getNameText } from '../../../components/UserName';
import { userProfileQuery } from '../graphql/queries';
import { ProfileForm } from '../component/ProfileForm';
import { useLogout } from '../../../hooks/useAuth';

const createDownloadData = (userData: UserDownloadQuery) => {
  const dataString = JSON.stringify(userData, (key, value) =>
    key === '__typename' ? undefined : value,
  );
  const downloadFileFormat = `data:text/json;charset=utf-8,${encodeURIComponent(
    dataString,
  )}`;
  return downloadFileFormat;
};

export const UserProfilePage = () => {
  const { data } = useUserProfileQuery();
  const [getData, { data: downloadableData, loading }] =
    useUserDownloadLazyQuery();
  const userInfo = data?.userInformation;
  const userDataDownload = downloadableData;

  const logout = useLogout();
  const router = useRouter();
  const client = useApolloClient();

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
    await router.push('/');
    await client.resetStore();
  };

  return (
    <div>
      {userInfo ? (
        <>
          <Heading as="h1" marginBlock={'.5em'}>
            Profile
          </Heading>
          <Heading as="h2" size={'lg'}>
            Welcome, {getNameText(userInfo.name)}
          </Heading>
          {userInfo.user_chapters.length > 0 && (
            <>
              <Heading as="h2" marginBlock={'.5em'} size="md">
                You are an member of these Chapters:
              </Heading>
              <Flex marginTop={'1em'} flexDirection={'column'} gap={4}>
                {userInfo.user_chapters.map(({ chapter }) => (
                  <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
                    {chapter.name}
                  </Link>
                ))}
              </Flex>
            </>
          )}
          <Heading as="h2" marginTop={'2em'} size="lg" fontWeight={500}>
            Email address:{' '}
            <Text as="span" fontWeight={700}>
              {userInfo.email}
            </Text>
          </Heading>
          <ProfileForm
            onSubmit={submitUpdateMe}
            data={userInfo}
            loadingText={'Saving Profile Changes'}
            submitText={'Save Profile Changes'}
          />
          <Flex gap="2em" marginBlock={'2em'}>
            <Button
              height={'2.8em'}
              paddingBlock={'.65em'}
              paddingInline={'.4em'}
              colorScheme={'red'}
              onClick={clickDelete}
            >
              Delete My Data
            </Button>
            <Button
              fontWeight="600"
              background={'gray.85'}
              color={'gray.10'}
              height={'100%'}
              size={'lg'}
              borderRadius={'5px'}
              paddingBlock={'.65em'}
              paddingInline={'.4em'}
              _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
              onClick={() => getData()}
              isDisabled={!!userDataDownload}
            >
              Request your data
            </Button>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {userDataDownload && (
                  <Flex alignItems={'center'} gap="2em">
                    <Text>The data was fetched succesfully 🥳</Text>
                    <Link
                      fontWeight="600"
                      background={'gray.85'}
                      color={'gray.10'}
                      height={'100%'}
                      size={'lg'}
                      borderRadius={'5px'}
                      paddingBlock={'.65em'}
                      paddingInline={'.4em'}
                      download={`${userDataDownload.userData?.name}.json`}
                      href={createDownloadData(userDataDownload)}
                    >
                      Click Here to download the data
                    </Link>
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </>
      ) : (
        <Heading as="h1">Please login to see your profile</Heading>
      )}
    </div>
  );
};
