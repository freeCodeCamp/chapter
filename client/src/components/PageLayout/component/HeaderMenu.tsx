import {
  Button,
  Flex,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { ApolloQueryResult } from '@apollo/client';
import Avatar from '../../Avatar';
import styles from '../../../styles/Header.module.css';
import { MeQuery } from 'generated/graphql';

export const HeaderMenu = ({
  text,
  SessionHandling,
}: {
  text: string;
  SessionHandling: () => Promise<void | ApolloQueryResult<MeQuery>>;
}) => {
  return (
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
            <MenuItem
              data-cy="logout-button"
              onClick={SessionHandling}
              fontWeight="600"
              background={'gray.85'}
              color={'gray.10'}
              height={'100%'}
              borderRadius={'5px'}
              _hover={{ color: 'gray.85' }}
            >
              {text}
            </MenuItem>
          </>
        </Flex>
      </MenuList>
    </Menu>
  );
};

export const HeaderUserMenu = ({
  user,
}: {
  user: {
    name: string;
    image_url?: string | null | undefined;
  };
}) => {
  return (
    <>
      <NextLink passHref href="/profile">
        <Avatar user={user} cursor="pointer" />
      </NextLink>
      <NextLink passHref href="/dashboard/chapters">
        <MenuItem as="a">Dashboard</MenuItem>
      </NextLink>
    </>
  );
};
