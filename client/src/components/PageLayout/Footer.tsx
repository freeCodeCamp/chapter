import { Flex, Link, Text } from '@chakra-ui/layout';
import React from 'react';
import style from '../../styles/Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <Flex
      flexDirection={['column', 'row']}
      backgroundColor={'gray.10'}
      className={style.footer}
    >
      <Text className={style.text}>
        Find out how is your information handled here:
        <Link className={style.link} href="/policy/">
          Policy
        </Link>
      </Text>
      <Text className={style.text}>
        Have an issue? you can check out:
        <Link
          className={style.link}
          href="https://www.freecodecamp.org/news/support/"
        >
          Support
        </Link>
      </Text>
    </Flex>
  );
};
