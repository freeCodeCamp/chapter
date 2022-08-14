import { HStack } from '@chakra-ui/layout';
import {
  Avatar,
  Button,
  Flex,
  Image,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
} from '@chakra-ui/react';
import type { GridItemProps } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { Input } from '../Form/Input';
import { useSession } from 'hooks/useSession';

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
  const { createSession } = useSession();
  return (
    <Button
      onClick={() => createSession().then(() => window.location.reload())}
    >
      Log In
    </Button>
  );
};

const Item = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      ref={ref}
      {...props}
      w="full"
      as="header"
      px={[2, 4, 8]}
      py={[2, 4]}
      className={styles.header}
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
    fetch(new URL('/logout', serverUrl).href, {
      method: 'DELETE',
      credentials: 'include',
    });

    router.push('/');
  };

  return (
    <>
      <Item>
        <Link href="/">
          <Image
            src="/freecodecamp-logo.svg"
            alt="The freeCodeCamp logo"
            display="block"
          />
        </Link>
        <Input
          background="hsl(239, 100%, 97%)"
          color="hsl(239, 100%, 13%)"
          noLabel
          placeholder="Search..."
        />
        <HStack as="nav">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              background="hsl(239, 100%, 93%)"
            >
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link href="/chapters">Chapters</Link>
              </MenuItem>
              <MenuItem>
                <Link href="/events">Events feed</Link>
              </MenuItem>
              {user ? (
                <>
                  <MenuItem>
                    <Link color="white" href="/dashboard/chapters">
                      Dashboard
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Button data-cy="logout-button" onClick={logout}>
                      Logout
                    </Button>
                  </MenuItem>
                </>
              ) : process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? (
                <MenuItem>
                  <DevLoginButton />
                </MenuItem>
              ) : (
                <MenuItem>
                  <LoginButton />
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          {user ? (
            <>
              <Avatar name={`${user.first_name} ${user.last_name}`} />
            </>
          ) : (
            <></>
          )}
        </HStack>
      </Item>
    </>
  );
};
