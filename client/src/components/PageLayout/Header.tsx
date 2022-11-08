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
} from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React from 'react';

import NextLink from 'next/link';
import Avatar from '../Avatar';
import styles from '../../styles/Header.module.css';
import { useAuth } from '../../modules/auth/store';
import { HeaderContainer } from './component/HeaderContainer';
import { useLogout, useLogin } from 'hooks/useAuth';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?

export const Header: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const logout = useLogout();
  const login = useLogin();
  const goHome = () => router.push('/');
  const CanEditDashboard = user?.instance_role.instance_role_permissions.filter(
    ({ instance_permission }) =>
      instance_permission.name === 'owner' || 'admin',
  );

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

                  <>
                    <NextLink passHref href="/profile">
                      <MenuItem as="a">Profile</MenuItem>
                    </NextLink>
                    {CanEditDashboard && (
                      <NextLink passHref href="/dashboard/chapters">
                        <MenuItem as="a">Dashboard</MenuItem>
                      </NextLink>
                    )}

                    {user ? (
                      <MenuItem
                        data-cy="logout-button"
                        onClick={() => logout().then(goHome)}
                        fontWeight="600"
                        height={'100%'}
                        borderRadius={'5px'}
                      >
                        logout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        data-cy="login-button"
                        onClick={login}
                        fontWeight="600"
                        background={'gray.85'}
                        color={'gray.10'}
                        height={'100%'}
                        borderRadius={'5px'}
                        _hover={{ color: 'gray.85' }}
                      >
                        login
                      </MenuItem>
                    )}
                  </>
                </Flex>
              </MenuList>
            </Menu>
          </Box>
          {user && (
            <Menu>
              <MenuButton>
                <Avatar user={user} cursor="pointer" />
              </MenuButton>
              <NextLink passHref href="/profile">
                <MenuItem as="a">Profile</MenuItem>
              </NextLink>
              {CanEditDashboard && (
                <NextLink passHref href="/dashboard/chapters">
                  <MenuItem as="a">Dashboard</MenuItem>
                </NextLink>
              )}
              <MenuItem
                data-cy="logout-button"
                onClick={() => logout().then(goHome)}
                fontWeight="600"
                height={'100%'}
                borderRadius={'5px'}
              >
                logout
              </MenuItem>
            </Menu>
          )}
        </HStack>
      </HeaderContainer>
    </>
  );
};
