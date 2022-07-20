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

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
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

  const logout = () => {
    setData({ user: undefined });
    localStorage.removeItem('token');

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
            <LoginButton />
            <LogoutButton />
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
            ) : (
              <Link color="white" href="/auth/login">
                Login / Register
              </Link>
            )}
          </HStack>
        </Item>
      </Grid>
    </>
  );
};
