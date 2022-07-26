import { HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import React from 'react';

import { Permission } from '../../../../../../common/permissions';
import { useCheckPermission } from 'hooks/useCheckPermission';

const links = [
  { text: 'Chapters', link: '/dashboard/chapters' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Venues', link: '/dashboard/venues' },
  {
    text: 'Sponsors',
    link: '/dashboard/sponsors',
    requiredPermission: Permission.SponsorsManage,
  },
  { text: 'Users', link: '/dashboard/users' },
];

export const Layout = ({
  children,
  ...rest
}: {
  children: React.ReactNode;
  [prop: string]: unknown;
}) => {
  const router = useRouter();
  return (
    <>
      <HStack {...rest} as="nav" my="2">
        {links
          .filter(
            ({ requiredPermission }) =>
              !requiredPermission || useCheckPermission(requiredPermission),
          )
          .map((item) => (
            <LinkButton
              key={item.link}
              href={item.link}
              colorScheme={
                router.pathname.startsWith(item.link) ? 'blue' : 'gray'
              }
            >
              {item.text}
            </LinkButton>
          ))}
      </HStack>
      {children}
    </>
  );
};
