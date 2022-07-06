import { HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import React from 'react';
import { useCheckPermission } from 'hooks/useCheckPermission';

const links = [
  { text: 'Chapters', link: '/dashboard/chapters' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Venues', link: '/dashboard/venues' },
  {
    text: 'Sponsors',
    link: '/dashboard/sponsors',
    permission: 'sponsors-manage',
  },
  { text: 'Users', link: '/dashboard/users' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <>
      <HStack as="nav" my="2">
        {links
          .filter(
            ({ permission }) =>
              typeof permission === 'undefined' ||
              useCheckPermission(permission),
          )
          .map((item) => (
            <LinkButton
              key={item.link}
              href={item.link}
              colorScheme={
                router.pathname.startsWith(item.link) ? 'blue' : undefined
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
