import { HStack } from '@chakra-ui/layout';
import {
  Box,
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import Avatar from '../Avatar';
import { useUser } from '../../modules/auth/user';
import { useAlert } from '../../hooks/useAlert';
import { useSession } from '../../hooks/useSession';
import { checkInstancePermission } from '../../util/check-permission';
import { Permission } from '../../../../common/permissions';
import { HeaderContainer } from './component/HeaderContainer';

const menuButtonStyles = {
  logout: { backgroundColor: 'gray.10' },
  login: {
    backgroundColor: 'transparent',
    _hover: {
      outline: '2px solid #dfdfe2',
    },
    _active: {},
  },
};
// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
export const Header: React.FC = () => {
  const router = useRouter();
  const { user, loadingUser } = useUser();
  const { login, logout, isAuthenticated, error } = useSession();
  const [loading, setLoading] = useState(false);

  const addAlert = useAlert();

  const goHome = () => router.push('/');

  useEffect(() => {
    if (loading || isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      addAlert({ title: 'Something went wrong', status: 'error' });
      setLoading(false);
      console.log(error);
    }
  }, [error]);

  return (
    <>
      <HeaderContainer>
        <SkipNavLink background={'gray.10'} color={'gray.85'}>
          Jump To Content
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
        <HStack as="nav" color="gray.85">
          {loadingUser ? (
            <Spinner color="white" size="xl" />
          ) : (
            <>
              {!user && (
                <Button
                  data-cy="login-button"
                  background="gray.10"
                  onClick={() => {
                    setLoading(true);
                    login();
                  }}
                  isLoading={loading}
                  fontWeight="600"
                  width="4.5em"
                >
                  Login
                </Button>
              )}
              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    data-cy="menu-button"
                    padding="0"
                    width="4.5em"
                    {...(user
                      ? menuButtonStyles.login
                      : menuButtonStyles.logout)}
                  >
                    {user ? (
                      <HStack spacing="0">
                        <Avatar
                          user={user}
                          cursor="pointer"
                          aria-label="menu"
                        />
                        <ChevronDownIcon
                          color="gray.10"
                          fontSize="xl"
                          opacity=".9"
                        />
                      </HStack>
                    ) : (
                      'Menu'
                    )}
                  </MenuButton>
                  <MenuList
                    paddingBlock={0}
                    display="flex"
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
                      <>
                        <NextLink passHref href="/profile">
                          <MenuItem
                            as="a"
                            borderTop="1px"
                            borderColor="gray.85"
                          >
                            Profile
                          </MenuItem>
                        </NextLink>
                        {checkInstancePermission(
                          user,
                          Permission.ChaptersView,
                        ) && (
                          <NextLink passHref href="/dashboard/chapters">
                            <MenuItem data-cy="menu-dashboard-link" as="a">
                              Dashboard
                            </MenuItem>
                          </NextLink>
                        )}
                        <MenuItem
                          data-cy="logout-button"
                          onClick={() => goHome().then(() => logout())}
                          fontWeight="600"
                          borderTop="1px"
                          borderColor="gray.85"
                        >
                          Logout
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Box>
            </>
          )}
        </HStack>
      </HeaderContainer>
    </>
  );
};
