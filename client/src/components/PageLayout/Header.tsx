import { HStack } from '@chakra-ui/layout';
import { Avatar, Button, Grid, GridItem, Image } from '@chakra-ui/react';
import type { GridItemProps } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { Input } from '../Form/Input';
import { useLogin } from 'hooks/useLogin';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

const DevLoginButton = () => {
  const { login } = useLogin();
  return (
    <Button onClick={() => login().then(() => window.location.reload())}>
      Log In
    </Button>
  );
};

const Item = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <GridItem
      display="flex"
      justifyContent="center"
      alignItems="center"
      ref={ref}
      {...props}
    />
  );
});

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    data: { user },
    setData,
  } = useAuthStore();

  const { logout: logoutAuth0 } = useAuth0();

  const logout = () => {
    setData({ user: undefined });
    // TODO: logging out of auth0 and the server should be handled by the same
    // module as logging in.
    // TODO: inject the auth functions (logout) into the Header so we can switch
    // strategies easily.
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'development') logoutAuth0();
    fetch(`${serverUrl}/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });

    router.push('/');
  };

  return (
    <>
      <Grid
        w="full"
        as="header"
        templateColumns="repeat(3, 1fr)"
        px="8"
        py="4"
        className={styles.header}
      >
        <Item justifyContent="flex-start">
          <Link href="/">
            <Image src="/freecodecamp-logo.svg" alt="The freeCodeCamp logo" />
          </Link>
        </Item>
        <Item>
          <Input noLabel color="white" placeholder="Search..." />
        </Item>
        <Item justifyContent="flex-end">
          <HStack as="nav">
            <Link color="white" href="/chapters">
              Chapters
            </Link>
            <Link color="white" href="/events">
              Events feed
            </Link>
            {user ? (
              <>
                <Link color="white" href="/dashboard/chapters">
                  Dashboard
                </Link>
                <Button data-cy="logout-button" onClick={logout}>
                  Logout
                </Button>
                <Avatar name={`${user.first_name} ${user.last_name}`} />
              </>
            ) : process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? (
              <DevLoginButton />
            ) : (
              <LoginButton />
            )}
          </HStack>
        </Item>
      </Grid>
    </>
  );
};
