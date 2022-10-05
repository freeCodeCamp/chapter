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
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import NextLink from 'next/link';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { Permission } from '../../../../common/permissions';
import { useCheckPermission } from 'hooks/useCheckPermission';
import { useLogin, useLogout } from 'hooks/useAuth';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}
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
  } = useAuthStore();
  const logout = useLogout();

  const canAuthenticateWithGoogle = useCheckPermission(
    Permission.GoogleAuthenticate,
  );

  const goHome = () => router.push('/');

  return (
    <>
      <HeaderItem>
        <SkipNavLink background={'gray.10'} color={'gray.85'}>
          Skip Navigation
        </SkipNavLink>
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
              <MenuList paddingBlock={0}>
                <Flex
                  className={styles.header}
                  flexDirection={'column'}
                  fontWeight="600"
                  borderRadius={'5px'}
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
                          href={
                            new URL('/authenticate-with-google', serverUrl).href
                          }
                          fontWeight="600"
                          background={'gray.85'}
                          color={'gray.10'}
                          height={'100%'}
                          borderRadius={'5px'}
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
          </Box>

          {user ? (
            <>
              <NextLink passHref href="/profile">
                <Avatar
                  cursor={'pointer'}
                  name={`${user.name}`}
                  src={`${user.image_url}`}
                  backgroundColor={user.image_url && 'transparent'}
                />
              </NextLink>
            </>
          ) : (
            <></>
          )}
        </HStack>
      </HeaderItem>
    </>
  );
};
