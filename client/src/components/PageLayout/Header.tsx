import { useApolloClient } from '@apollo/client';
import { HStack } from '@chakra-ui/layout';
import {
  Box,
  Image,
  Button,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Spinner,
} from '@chakra-ui/react';
import { Link, LinkButton } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Avatar from '../Avatar';
import { useAuth } from '../../modules/auth/store';
import { useLogout, useLogin } from '../../hooks/useAuth';
import { Permission } from '../../../../common/permissions';
import { HeaderContainer } from './component/HeaderContainer';
import { checkPermission } from 'util/check-permission';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const logout = useLogout();
  const login = useLogin();
  const client = useApolloClient();

  const goHome = () => {
    router.push('/').then(() => client.resetStore());
  };

  return (
    <>
      <HeaderContainer>
        <SkipNavLink background={'gray.10'} color={'gray.85'}>
          Skip Navigation
        </SkipNavLink>
        <Link
          href="/"
          _focus={{
            outlineColor: 'blue.600',
            outlineOffset: '5px',
          }}
          _focusVisible={{
            boxShadow: 'none',
          }}
        >
          <Image
            src="/freecodecamp-logo.svg"
            alt="The freeCodeCamp logo"
            display="block"
            width="100%"
          />
        </Link>
        <HStack as="nav">
          <Box>
            {loadingUser ? (
              <Spinner color="white" size="xl" />
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  data-cy="menu-button"
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

                    {user && (
                      <Box borderBlock={'1px'} borderColor={'gray.85'}>
                        <NextLink passHref href="/profile">
                          <MenuItem as="a">Profile</MenuItem>
                        </NextLink>

                        {checkPermission(user, Permission.ChaptersView) && (
                          <NextLink passHref href="/dashboard/chapters">
                            <MenuItem data-cy="menu-dashboard-link" as="a">
                              Dashboard
                            </MenuItem>
                          </NextLink>
                        )}
                      </Box>
                    )}
                    {user ? (
                      <MenuItem
                        data-cy="logout-button"
                        onClick={() => logout().then(goHome)}
                        fontWeight="600"
                        height={'100%'}
                      >
                        Logout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        data-cy="login-button"
                        onClick={login}
                        fontWeight="600"
                        height={'100%'}
                      >
                        Login
                      </MenuItem>
                    )}
                  </Flex>
                </MenuList>
              </Menu>
            )}
          </Box>
          {user && (
            <LinkButton
              width="16px"
              href="/profile"
              backgroundColor="transparent"
              _focus={{
                outlineColor: 'blue.600',
                outlineOffset: '5px',
              }}
              borderRadius="50%"
              _focusVisible={{
                boxShadow: 'none',
              }}
            >
              <Avatar user={user} cursor="pointer" />
            </LinkButton>
          )}
        </HStack>
      </HeaderContainer>
    </>
  );
};
