import { HStack } from '@chakra-ui/layout';
import { Avatar, Box, Flex, Image, Spinner, Button } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import React from 'react';
import NextLink from 'next/link';

import { useRouter } from 'next/router';
import { useAuthStore } from '../../modules/auth/store';
import { useLogin, useLogout } from '../../hooks/useAuth';
import { HeaderMenu } from './components/HeaderMenu';
import { HeaderContainer } from './components/HeaderContainer';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?
const LoginButton = () => {
  const login = useLogin();
  return (
    <Button
      onClick={login}
      background={'gray.10'}
      paddingBlock={'.65em'}
      paddingInline={'1em'}
      fontSize={'md'}
      fontWeight="600"
      height={'100%'}
      borderRadius={'5px'}
    >
      Log In
    </Button>
  );
};

const LogoutButton = () => {
  const router = useRouter();
  const logout = useLogout();
  const goHome = () => router.push('/');
  return (
    <Button
      background={'transparent'}
      justifyContent={'flex-start'}
      onClick={() => logout().then(goHome)}
    >
      Log out
    </Button>
  );
};

export const Header: React.FC = () => {
  const {
    data: { user, loadingUser },
  } = useAuthStore();

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
        {loadingUser ? (
          <Spinner color="white" size="xl" />
        ) : (
          <HStack as="nav">
            <Box>
              {!user ? (
                <LoginButton />
              ) : (
                <Flex gap={'2'} alignItems={'center'}>
                  <NextLink passHref href="/profile">
                    <Avatar cursor="pointer" name={`${user.name}`} />
                  </NextLink>
                  <Box>
                    <HeaderMenu LogoutButton={LogoutButton} />
                  </Box>
                </Flex>
              )}
            </Box>
          </HStack>
        )}
      </HeaderContainer>
    </>
  );
};
