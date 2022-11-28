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
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
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
                <MenuList paddingBlock={0} as="ul">
                  <Flex
                    flexDirection="column"
                    fontWeight="600"
                    borderRadius="5px"
                  >
                    <MenuItem as="li" cursor="pointer">
                      <Link width="100%" href="/chapters">
                        Chapters
                      </Link>
                    </MenuItem>

                    <MenuItem as="li" cursor="pointer">
                      <Link width="100%" href="/events">
                        Events
                      </Link>
                    </MenuItem>

                    {user && (
                      <Box borderBlock={'1px'} borderColor={'gray.85'}>
                        <MenuItem as="li" cursor="pointer">
                          <Link width="100%" href="/profile">
                            Profile
                          </Link>
                        </MenuItem>

                        {checkPermission(user, Permission.ChaptersView) && (
                          <MenuItem
                            data-cy="menu-dashboard-link"
                            as="li"
                            cursor="pointer"
                          >
                            <Link width="100%" href="/dashboard/chapters">
                              Dashboard
                            </Link>
                          </MenuItem>
                        )}
                      </Box>
                    )}
                    {user ? (
                      <MenuItem
                        data-cy="logout-button"
                        onClick={() => logout().then(goHome)}
                        fontWeight="600"
                      >
                        Logout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        data-cy="login-button"
                        onClick={login}
                        fontWeight="600"
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
            <Link width="100%" href="/profile">
              <Avatar user={user} cursor="pointer" />
            </Link>
          )}
        </HStack>
      </HeaderContainer>
    </>
  );
};
