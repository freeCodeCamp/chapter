import { HStack } from '@chakra-ui/layout';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';
import type { GridItemProps } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import NextLink from 'next/link';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { Permission } from '../../../../common/permissions';
import { useSession } from 'hooks/useSession';
import { useCheckPermission } from 'hooks/useCheckPermission';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <MenuItem onClick={() => loginWithRedirect()}>Log In</MenuItem>;
};

const DevLoginButton = () => {
  const { createSession } = useSession();
  return (
    <MenuItem
      onClick={() => createSession().then(() => window.location.reload())}
    >
      Log In
    </MenuItem>
  );
};

const HeaderItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      ref={ref}
      {...props}
      w="full"
      as="header"
      px={[2, 4, 8]}
      py={[2, 4]}
      background={'gray.85'}
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

  const canAuthenticateWithGoogle = useCheckPermission(
    Permission.GoogleAuthenticate,
  );

  const logout = () => {
    setData({ user: undefined });
    // TODO: logging out of auth0 and the server should be handled by the same
    // module as logging in.
    // TODO: inject the auth functions (logout) into the Header so we can switch
    // strategies easily.
    if (process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false') logoutAuth0();
    fetch(new URL('/logout', serverUrl).href, {
      method: 'DELETE',
      credentials: 'include',
    });

    router.push('/');
  };

  return (
    <>
      <HeaderItem>
        <Link href="/">
          <Image
            src="/freecodecamp-logo.svg"
            alt="The freeCodeCamp logo"
            display="block"
            width="100%"
          />
        </Link>
        <HStack as="nav">
          <Box>
            <Menu>
              <MenuButton
                as={Button}
                aria-label="Options"
                variant="outline"
                background={'gray.10'}
                px={[2, 4]}
                py={[1, 2]}
              >
                Menu
              </MenuButton>
              <MenuList>
                <Flex className={styles.header} flexDirection={'column'}>
                  <NextLink passHref href="/chapters">
                    <MenuItem as="a">Chapters</MenuItem>
                  </NextLink>

                  <NextLink passHref href="/events">
                    <MenuItem as="a">Events</MenuItem>
                  </NextLink>

                  {user ? (
                    <>
                      <NextLink passHref href="/dashboard/chapters">
                        <MenuItem as="a">Dashboard</MenuItem>
                      </NextLink>

                      {canAuthenticateWithGoogle && (
                        <MenuItem
                          as="a"
                          href={
                            new URL('/authenticate-with-google', serverUrl).href
                          }
                        >
                          Authenticate with Google
                        </MenuItem>
                      )}

                      <MenuItem data-cy="logout-button" onClick={logout}>
                        Logout
                      </MenuItem>
                    </>
                  ) : process.env.NEXT_PUBLIC_USE_AUTH0 === 'false' ? (
                    <DevLoginButton />
                  ) : (
                    <LoginButton />
                  )}
                </Flex>
              </MenuList>
            </Menu>
          </Box>

          {user ? (
            <>
              <Avatar name={`${user.name}`} />
            </>
          ) : (
            <></>
          )}
        </HStack>
      </HeaderItem>
    </>
  );
};
