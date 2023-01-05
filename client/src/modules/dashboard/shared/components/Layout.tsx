import { IconButton, HStack, Text } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import NextError from 'next/error';
import React, { createRef, useEffect, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Permission } from '../../../../../../common/permissions';
import { checkPermission } from '../../../../util/check-permission';
import { Loading } from '../../../../components/Loading';
import { useAuth } from 'modules/auth/store';

const iconSize = '1.5em';
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
const scrollWidth = 50;

export const Layout = ({
  children,
  dataCy,
  ...rest
}: {
  children: React.ReactNode;
  dataCy?: string;
  [prop: string]: unknown;
}) => {
  const ref = createRef<HTMLDivElement>();
  const buttonRef = createRef<HTMLButtonElement>();
  const router = useRouter();
  const [displayLeftScroll, setDisplayLeftScroll] = useState(false);
  const [displayRightScroll, setDisplayRightScroll] = useState(false);
  const [leftScroll, setLeftScroll] = useState(true);
  const [rightScroll, setRightScroll] = useState(true);
  const { user, loadingUser, isLoggedIn } = useAuth();

  const updateLayout = () => {
    if (!ref.current) return;

    const widthWithButtons =
      ref.current.scrollWidth -
      2 * (buttonRef.current ? buttonRef.current.clientWidth : 0);
    if (widthWithButtons > ref.current.clientWidth) {
      setDisplayLeftScroll(true);
      setDisplayRightScroll(true);
    }
    if (widthWithButtons < ref.current.clientWidth) {
      setDisplayLeftScroll(false);
      setDisplayRightScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateLayout);
  });

  const setScrolls = () => {
    if (!ref.current) return;

    const div = ref.current;
    const left = div.scrollLeft;
    if (leftScroll && left === 0) setLeftScroll(false);
    if (!leftScroll && left > 0) setLeftScroll(true);

    const maximumLeft = div.scrollWidth - div.clientWidth;
    if (rightScroll && left === maximumLeft) setRightScroll(false);
    if (!rightScroll && left < maximumLeft) setRightScroll(true);
  };

  useEffect(() => {
    if (displayLeftScroll || displayRightScroll) setScrolls();
  }, [displayLeftScroll, displayRightScroll]);

  const linksWithPermissions = links.map((link) => {
    if (!link.requiredPermission) return link;
    const hasPermission = checkPermission(user, link.requiredPermission);
    return { ...link, hasPermission };
  });

  const scroll = (scrollToLeft: boolean, element?: HTMLDivElement | null) => {
    if (element)
      element.scrollBy({
        left: scrollToLeft ? scrollWidth : -scrollWidth,
        behavior: 'smooth',
      });
  };

  if (loadingUser) return <Loading loading={loadingUser} />;
  if (!isLoggedIn)
    return <NextError statusCode={401} title={'Log in to see this page'} />;

  return (
    <div data-cy={dataCy}>
      <HStack my="2">
        <IconButton
          aria-label="Scroll left"
          icon={<ChevronLeftIcon boxSize={iconSize} />}
          isDisabled={!leftScroll}
          onClick={() => scroll(false, ref.current)}
          ref={buttonRef}
          {...(!displayLeftScroll && { display: 'none' })}
        />
        <HStack
          {...rest}
          as="nav"
          data-cy="dashboard-tabs"
          onScroll={() => setScrolls()}
          overflowX="auto"
          ref={ref}
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
        <IconButton
          aria-label="Scroll right"
          icon={<ChevronRightIcon boxSize={iconSize} />}
          isDisabled={!rightScroll}
          onClick={() => scroll(true, ref.current)}
          {...(!displayRightScroll && { display: 'none' })}
        />
      </HStack>
      {children}
    </div>
  );
};
