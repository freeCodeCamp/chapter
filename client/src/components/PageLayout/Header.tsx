import { useApolloClient } from '@apollo/client';
import {
  Image,
  Button,
  HStack,
  Spinner,
  Link,
  useDisclosure,
  Collapse,
  Flex,
} from '@chakra-ui/react';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import Avatar from '../Avatar';
import { useAuth } from '../../modules/auth/store';
import { useLogout, useLogin } from '../../hooks/useAuth';
import { Permission } from '../../../../common/permissions';
import { HeaderContainer } from './component/HeaderContainer';
import { checkPermission } from 'util/check-permission';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
export const Header: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
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
        <HStack as="nav">
          {loadingUser ? (
            <Spinner color="white" size="xl" />
          ) : (
            <>
              <HStack display={{ base: 'none', lg: 'flex' }}>
                <Link color="gray.10" href="/chapters">
                  Chapters
                </Link>
                <Link color="gray.10" href="/events">
                  Events
                </Link>
                {user && (
                  <>
                    <Link color="gray.10" href="/profile">
                      Profile
                    </Link>
                    {checkPermission(user, Permission.ChaptersView) && (
                      <Link
                        color="gray.10"
                        href="/dashboard/chapters"
                        data-cy="menu-dashboard-link"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Button
                      data-cy="logout-button"
                      onClick={() => logout().then(goHome)}
                      fontWeight="600"
                      borderTop={'1px'}
                      borderColor={'gray.85'}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </HStack>

              {user ? (
                <Button
                  display={{ base: 'flex', lg: 'none' }}
                  onFocus={onToggle}
                  onClick={onToggle}
                  padding="0"
                  backgroundColor="transparent"
                  _hover={{
                    outline: '2px solid #858591',
                    outlineOffset: '1px',
                  }}
                  _active={{}}
                >
                  <Avatar user={user} cursor="pointer" aria-label="menu" />
                  <ChevronDownIcon
                    color="gray.00"
                    opacity=".7"
                    fontSize="3xl"
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button
                  data-cy="login-button"
                  background="gray.10"
                  onClick={login}
                  fontWeight="600"
                  width="4.5em"
                >
                  Login
                </Button>
              )}
            </>
          )}
        </HStack>
      </HeaderContainer>
      <Collapse in={isOpen}>
        <Flex
          display={{ base: 'flex', lg: 'none' }}
          gap=".25em"
          onClick={onToggle}
          flexDirection="column"
          paddingInline="1em"
          backgroundColor="gray.00"
          color="gray.85"
          boxShadow="lg"
        >
          <Link
            fontWeight="600"
            paddingBlock=".25em"
            href="/chapters"
            _hover={{
              textDecoration: 'none',
            }}
          >
            Chapter
          </Link>
          <Link
            fontWeight="600"
            paddingBlock=".25em"
            href="/events"
            _hover={{
              textDecoration: 'none',
            }}
          >
            Events
          </Link>
          {user && (
            <>
              <Link
                fontWeight="600"
                paddingBlock=".25em"
                borderTop="1px"
                borderColor="gray.85"
                href="/profile"
                _hover={{
                  textDecoration: 'none',
                }}
              >
                Profile
              </Link>
              {checkPermission(user, Permission.ChaptersView) && (
                <Link
                  fontWeight="600"
                  paddingBlock=".25em"
                  href="/dashboard/chapters"
                  _hover={{
                    textDecoration: 'none',
                  }}
                >
                  Dashboard
                </Link>
              )}
              <Button
                data-cy="logout-button"
                onClick={() => logout().then(goHome)}
                borderTop="1px"
                borderColor="gray.85"
                paddingBlock=".25em"
                fontWeight="600"
                background="transparent"
                textAlign="left"
                justifyContent="flex-start"
                paddingInline="0"
              >
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Collapse>
    </>
  );
};
