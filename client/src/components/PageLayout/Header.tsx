import React, { forwardRef } from 'react';
import {
  Avatar,
  Button,
  Grid,
  GridItem,
  GridItemProps,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { HStack } from '@chakra-ui/layout';
import { Link } from 'chakra-next-link';

import { Input } from '../Form/Input';
import { useAuthStore } from '../../modules/auth/store';

const Item = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
  return (
    <GridItem
      d="flex"
      justifyContent="center"
      alignItems="center"
      ref={ref}
      {...props}
    />
  );
});

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    data: { user },
    setData,
  } = useAuthStore();

  const logout = () => {
    setData({ user: undefined });
    localStorage.removeItem('token');

    router.push('/');
  };

  return (
    <>
      {/* TODO: Extract color into theme */}
      <Grid
        w="full"
        bg="#1b1b32"
        as="header"
        templateColumns="repeat(3, 1fr)"
        px="8"
        py="4"
      >
        <Item justifyContent="flex-start">
          <Link href="/">
            <Image src="/freecodecamp-logo.svg" alt="The freeCodeCamp logo" />
          </Link>
        </Item>
        <Item>
          <Input noLabel color="white" placeholder="Search..." />
        </Item>
        <Item justifyContent="flex-end">
          <HStack as="nav">
            <Link color="white" href="/chapters">
              Chapters
            </Link>
            <Link color="white" href="/events">
              Events feed
            </Link>

            {user ? (
              <>
                <Button onClick={logout}>Logout</Button>
                <Avatar name={`${user.first_name} ${user.last_name}`} />
              </>
            ) : (
              <Link color="white" href="/auth/login">
                Login / Register
              </Link>
            )}
          </HStack>
        </Item>
      </Grid>
    </>
  );
};
