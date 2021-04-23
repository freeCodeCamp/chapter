import React from 'react';
import { LinkButton } from 'chakra-next-link';

import links from '../../../../constants/DashboardLinks';
import { HStack } from '@chakra-ui/layout';

const Navbar: React.FC = () => {
  return (
    <HStack as="nav">
      {links.map((item) => (
        <LinkButton key={item.link} href={item.link}>
          {item.text}
        </LinkButton>
      ))}
    </HStack>
  );
};

export default Navbar;
