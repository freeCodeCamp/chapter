import {
  Button,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import styles from '../../styles/Header.module.css';
import { useLogin } from 'hooks/useAuth';
import { MeQuery } from 'generated/graphql';
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
const LoginButton = () => {
  const login = useLogin();
  return (
    <MenuItem
      onClick={login}
      fontWeight="600"
      background={'gray.85'}
      color={'gray.10'}
      height={'100%'}
      borderRadius={'5px'}
      _hover={{ color: 'gray.85' }}
    >
      Log In
    </MenuItem>
  );
};

export const HeaderMenu = ({
  logout,
  goHome,
  canAuthenticateWithGoogle,
  user,
}: {
  logout: () => any;
  goHome: () => any;
  canAuthenticateWithGoogle: boolean;
  user: MeQuery;
}) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="Options"
        variant="outline"
        background="gray.10"
        px={[2, 4]}
        py={[1, 2]}
      >
        Menu
      </MenuButton>
      <MenuList paddingBlock={0}>
        <Flex
          className={styles.header}
          flexDirection="column"
          fontWeight="600"
          borderRadius="5px"
        >
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
              <NextLink passHref href="/profile">
                <MenuItem as="a">Profile</MenuItem>
              </NextLink>

              {canAuthenticateWithGoogle && (
                <MenuItem
                  as="a"
                  href={new URL('/authenticate-with-google', serverUrl).href}
                  fontWeight="600"
                  background="gray.85"
                  color="gray.10"
                  height="100%"
                  borderRadius="5px"
                  _hover={{ color: 'gray.85' }}
                >
                  Authenticate with Google
                </MenuItem>
              )}

              <MenuItem
                data-cy="logout-button"
                onClick={() => logout().then(goHome)}
                fontWeight="600"
              >
                Logout
              </MenuItem>
            </>
          ) : (
            <LoginButton />
          )}
        </Flex>
      </MenuList>
    </Menu>
  );
};
export default HeaderMenu;
