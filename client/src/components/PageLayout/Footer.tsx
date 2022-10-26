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
        Find out how your data is handled on
        <Link className={style.link} href="/policy/">
          the policy page
        </Link>
      </Text>
      <Text className={style.text}>
        Found a bug? Ask for help on the forum
        <Link
          className={style.link}
          href="https://www.freecodecamp.org/news/support/"
        >
          the forum
        </Link>
      </Text>
    </Flex>
  );
};
