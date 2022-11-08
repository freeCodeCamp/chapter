import { HStack } from '@chakra-ui/layout';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from '../../modules/auth/store';
import { HeaderMenu, HeaderUserMenu } from './component/HeaderMenu';
import { HeaderContainer } from './component/HeaderContainer';
import { useLogout, useLogin } from 'hooks/useAuth';

// TODO: distinguish between logging into the app and logging into Auth0. Maybe
// use sign-in for the app?

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const logout = useLogout();
  const login = useLogin();

  const goHome = () => router.push('/');
  enum Session {
    logoutSession = logout().then(goHome),
    loginSession = login,
  }

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
              <HeaderMenu SessionHandling={Session} text={'Log In'} />
            </Box>
            {user && <HeaderUserMenu user={user} />}
          </HStack>
        )}
      </HeaderContainer>
    </>
  );
};
