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
import styles from '../../../styles/Header.module.css';

export const HeaderMenu = ({ LogoutButton }: { LogoutButton: React.FC }) => {
  return (
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
            <MenuItem marginTop={'.25em'} as="a">
              Dashboard
            </MenuItem>
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
          <LogoutButton />
        </Flex>
      </MenuList>
    </Menu>
  );
};
