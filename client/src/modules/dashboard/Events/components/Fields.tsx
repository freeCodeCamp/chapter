import { Link, Text } from '@chakra-ui/react';
import React from 'react';
import { Link as NextLink } from 'chakra-next-link';

export const LinkField = ({
  children,
  isExternal = false,
  href,
  label,
}: {
  children: React.ReactNode;
  isExternal?: boolean;
  href?: string;
  label: string;
}) => {
  const LinkComponent = isExternal ? Link : NextLink;
  return (
    <Text opacity="0.9">
      {label}:{' '}
      <LinkComponent
        fontWeight={500}
        href={href || children?.toString()}
        isExternal={isExternal}
      >
        {children}
      </LinkComponent>
    </Text>
  );
};

export const TextField = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <Text opacity="0.9">
    {label}:{' '}
    <Text as="span" fontWeight={500}>
      {children}
    </Text>
  </Text>
);
