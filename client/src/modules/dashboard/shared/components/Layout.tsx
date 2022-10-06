import { HStack } from '@chakra-ui/layout';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
  const [isLoading, setLoading] = useState(true);
  const { user, loadingUser } = useAuth();

  const linksWithPermissions = links.map((link) => {
    if (!link.requiredPermission) return link;
    const hasPermission = checkPermission(user, link.requiredPermission);
    return { ...link, loading: loadingUser, hasPermission };
  });

  useEffect(() => {
    if (
      linksWithPermissions.every(
        (link) => !link.requiredPermission || !link.loading,
      )
    ) {
      setLoading(false);
    }
  }, [linksWithPermissions]);
  if (isLoading) return <Loading loading={isLoading} />;

  return (
    <div data-cy={dataCy}>
      <HStack {...rest} data-cy="dashboard-tabs" as="nav" my="2">
        {linksWithPermissions
          .filter((link) => !link.requiredPermission || link.hasPermission)
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
    </div>
  );
};
