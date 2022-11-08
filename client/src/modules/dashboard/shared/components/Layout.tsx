import { HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import NextError from 'next/error';
import React from 'react';

import { Permission } from '../../../../../../common/permissions';
import { checkPermission } from '../../../../util/check-permission';
import { Loading } from '../../../../components/Loading';
import { useAuth } from 'modules/auth/store';

const links = [
  {
    text: 'Chapters',
    link: '/dashboard/chapters',
    requiredPermission: Permission.ChapterEdit,
  },
  {
    text: 'Events',
    link: '/dashboard/events',
    requiredPermission: Permission.EventEdit,
  },
  {
    text: 'Venues',
    link: '/dashboard/venues',
    requiredPermission: Permission.VenueEdit,
  },
  {
    text: 'Sponsors',
    link: '/dashboard/sponsors',
    requiredPermission: Permission.SponsorManage,
  },
  {
    text: 'Users',
    link: '/dashboard/users',
    requiredPermission: Permission.UsersView,
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
      {linksWithPermissions
        .filter((link) => !link.requiredPermission)
        .map((item) => (
          <>
            <HStack {...rest} data-cy="dashboard-tabs" as="nav" my="2">
              <LinkButton
                key={item.link}
                href={item.link}
                colorScheme={
                  router.pathname.startsWith(item.link) ? 'blue' : 'gray'
                }
              >
                {item.text}
              </LinkButton>
            </HStack>
            {children}
          </>
        ))}
    </div>
  );
};
