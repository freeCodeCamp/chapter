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
  Spinner,
} from '@chakra-ui/react';
import type { GridItemProps } from '@chakra-ui/react';
import { Link } from 'chakra-next-link';
import { SkipNavLink } from '@chakra-ui/skip-nav';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import NextLink from 'next/link';

import { useAuthStore } from '../../modules/auth/store';
import styles from '../../styles/Header.module.css';
import { useLogin, useLogout } from 'hooks/useAuth';

interface Props {
  children: React.ReactNode;
  justifyContent?: GridItemProps['justifyContent'];
}

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
            {!user ? (
              <LoginButton />
            ) : (
              <Flex gap={'2'} alignItems={'center'}>
                <NextLink passHref href="/profile">
                  <Avatar cursor="pointer" name={`${user.name}`} />
                </NextLink>
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
                      <NextLink passHref href="/dashboard/chapters">
                        <MenuItem as="a">Dashboard</MenuItem>
                      </NextLink>

                      <NextLink passHref href="/profile">
                        <MenuItem
                          as="a"
                          background={'gray.85'}
                          color={'gray.10'}
                          fontWeight="600"
                          height={'100%'}
                          borderRadius={'5px'}
                          width="100%"
                          _hover={{ color: 'gray.85' }}
                        >
                          Profile
                        </MenuItem>
                      </NextLink>

                      <MenuItem
                        data-cy="logout-button"
                        onClick={() => logout().then(goHome)}
                        fontWeight="600"
                      >
                        Logout
                      </MenuItem>
                    </Flex>
                  </MenuList>
                </Menu>
              </Flex>
            )}
          </Box>
        </HStack>
        )
       )}
      </HeaderItem>
    </>
  );
};
