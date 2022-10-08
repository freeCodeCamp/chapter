import { HStack } from '@chakra-ui/layout';
import { Avatar, Box, Flex, Image, Spinner } from '@chakra-ui/react';
import type { GridItemProps } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import NextLink from 'next/link';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { Permission } from '../../../../common/permissions';
import { checkPermission } from '../../util/check-permission';
import HeaderMenu from './HeaderMenu';
import { useLogout } from 'hooks/useAuth';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}

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
    data: { user, loadingUser },
  } = useAuthStore();
  const logout = useLogout();

  const canAuthenticateWithGoogle = checkPermission(
    user,
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
        {loadingUser ? (
          <Spinner color="white" size="xl" />
        ) : (
          <HStack as="nav">
            <Box>
              <HeaderMenu
                logout={logout}
                goHome={goHome}
                canAuthenticateWithGoogle={canAuthenticateWithGoogle}
                user={user}
              />
            </Box>
            {user && (
              <NextLink passHref href="/profile">
                <Avatar cursor="pointer" name={`${user.name}`} />
              </NextLink>
            )}
          </HStack>
        )}
      </HeaderItem>
    </>
  );
};
