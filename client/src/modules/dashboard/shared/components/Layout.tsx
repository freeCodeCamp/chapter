import { HStack, Text } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import NextError from 'next/error';
import React from 'react';

import { Permission } from '../../../../../../common/permissions';
import { checkPermission } from '../../../../util/check-permission';
import { Loading } from '../../../../components/Loading';
import { useAuth } from 'modules/auth/store';

const links = [
  { text: 'Chapters', link: '/dashboard/chapters' },
  { text: 'Events', link: '/dashboard/events' },
  { text: 'Venues', link: '/dashboard/venues' },
  {
    text: 'Sponsors',
    link: '/dashboard/sponsors',
    requiredPermission: Permission.SponsorView,
  },
  {
    text: 'Users',
    link: '/dashboard/users',
    requiredPermission: Permission.UsersView,
  },
  {
    text: 'Calendar',
    link: '/dashboard/calendar',
    requiredPermission: Permission.GoogleAuthenticate,
  },
];

export const Layout = ({
  children,
  dataCy,
  ...rest
}: {
  children: React.ReactNode;
  dataCy?: string;
  [prop: string]: unknown;
}) => {
  const router = useRouter();
  const { user, loadingUser, isLoggedIn } = useAuth();

  const linksWithPermissions = links.map((link) => {
    if (!link.requiredPermission) return link;
    const hasPermission = checkPermission(user, link.requiredPermission);
    return { ...link, hasPermission };
  });

  if (loadingUser) return <Loading loading={loadingUser} />;
  if (!isLoggedIn)
    return <NextError statusCode={401} title={'Log in to see this page'} />;

  return (
    <div data-cy={dataCy}>
      <HStack
        {...rest}
        as="nav"
        data-cy="dashboard-tabs"
        my="2"
        overflowX="auto"
      >
        {linksWithPermissions
          .filter((link) => !link.requiredPermission || link.hasPermission)
          .map((item) => (
            <LinkButton
              colorScheme={
                router.pathname.startsWith(item.link) ? 'blue' : 'gray'
              }
              href={item.link}
              key={item.link}
              minWidth="fit-content"
            >
              {item.text}{' '}
              <Text srOnly as="span">
                Dashboard
              </Text>
            </LinkButton>
          ))}
      </HStack>
      {children}
    </div>
  );
};
