import { IconButton, HStack, Text } from '@chakra-ui/react';
import { LinkButton } from 'chakra-next-link';
import { useRouter } from 'next/router';
import NextError from 'next/error';
import React, { createRef, useLayoutEffect, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Permission } from '../../../../../../common/permissions';
import { checkInstancePermission } from '../../../../util/check-permission';
import { Loading } from '../../../../components/Loading';
import { useUser } from '../../../auth/user';

const iconSize = '1.5em';
const links = [
  {
    text: 'Chapters',
    link: '/dashboard/chapters',
    requiredPermission: Permission.ChaptersView,
  },
  {
    text: 'Events',
    link: '/dashboard/events',
    requiredPermission: Permission.EventsView,
  },
  {
    text: 'Venues',
    link: '/dashboard/venues',
    requiredPermission: Permission.VenuesView,
  },
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
const scrollWidth = 150;

export const DashboardLayout = ({
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
  const { user, loadingUser, isLoggedIn } = useUser();

  const setScrollButtonsDisplay = () => {
    if (!ref.current) return;
    const buttonWidth = buttonRef.current ? buttonRef.current.clientWidth : 0;
    const widthWithButtons = ref.current.scrollWidth - 2 * buttonWidth;
    if (widthWithButtons > ref.current.clientWidth) {
      setDisplayLeftScroll(true);
      setDisplayRightScroll(true);
    } else {
      setDisplayLeftScroll(false);
      setDisplayRightScroll(false);
    }
  };

  const setScrollButtonsToggle = () => {
    if (!ref.current) return;
    const element = ref.current;
    const fromLeft = element.scrollLeft;
    if (leftScroll && fromLeft === 0) setLeftScroll(false);
    if (!leftScroll && fromLeft > 0) setLeftScroll(true);

    const maximumFromLeft = element.scrollWidth - element.clientWidth;
    if (rightScroll && fromLeft === maximumFromLeft) setRightScroll(false);
    if (!rightScroll && fromLeft < maximumFromLeft) setRightScroll(true);
  };

  useLayoutEffect(() => {
    setScrollButtonsDisplay();
    setScrollButtonsToggle();
    window.addEventListener('resize', setScrollButtonsDisplay);
    window.addEventListener('resize', setScrollButtonsToggle);
  });

  const linksWithPermissions = links.map((link) => {
    const hasPermission = link.requiredPermission
      ? checkInstancePermission(user, link.requiredPermission)
      : true;
    return { ...link, hasPermission };
  });

  const scroll = (scrollBy: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
  };

  if (loadingUser) return <Loading />;
  if (!isLoggedIn)
    return <NextError statusCode={401} title={'Log in to see this page'} />;

  return (
    <div data-cy={dataCy}>
      <HStack my="2">
        <IconButton
          aria-label="Scroll left"
          icon={<ChevronLeftIcon boxSize={iconSize} />}
          isDisabled={!leftScroll}
          onClick={() => scroll(-scrollWidth)}
          ref={buttonRef}
          {...(!displayLeftScroll && { display: 'none' })}
        />
        <HStack
          as="nav"
          data-cy="dashboard-tabs"
          onScroll={setScrollButtonsToggle}
          overflowX="auto"
          ref={ref}
          {...rest}
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
          onClick={() => scroll(scrollWidth)}
          {...(!displayRightScroll && { display: 'none' })}
        />
      </HStack>
      {children}
    </div>
  );
};
