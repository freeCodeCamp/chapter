import React, { useEffect, useState } from 'react';
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Spinner,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useConfirmDelete } from 'chakra-confirm';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import {
  useDeleteMeMutation,
  useToggleAutoSubscribeMutation,
  useUpdateMeMutation,
  UpdateUserInputs,
} from '../../../generated/graphql';
import { useAuthStore } from '../../auth/store';
import { meQuery } from '../../auth/graphql/queries';
import { ProfileForm } from '../component/ProfileForm';
import { useLogout } from 'hooks/useAuth';

export const UserProfilePage = () => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const {
    data: { user },
  } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();
  const [autoSubscribe, setAutoSubscribe] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setAutoSubscribe(user?.auto_subscribe);
  }, [user]);

  const confirmDelete = useConfirmDelete({ doubleConfirm: true });
  const [deleteMe] = useDeleteMeMutation();
  const [toggleAutoSubscribe] = useToggleAutoSubscribeMutation({
    refetchQueries: [{ query: meQuery }],
  });
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
  const onSwitch = async () => {
    setLoading(true);
    setAutoSubscribe(!autoSubscribe);
    await toggleAutoSubscribe();
    setLoading(false);
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
          <FormControl>
            <Flex>
              <FormLabel htmlFor="subscription">
                Automatic subscription
              </FormLabel>
              <Switch
                id="subscription"
                isChecked={autoSubscribe}
                onChange={onSwitch}
                isDisabled={isLoading}
              />
              {isLoading && <Spinner size="sm" />}
            </Flex>
            <FormHelperText>
              Subscribe automatically to chapters that you join and RSVPed
              events.
            </FormHelperText>
          </FormControl>
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
