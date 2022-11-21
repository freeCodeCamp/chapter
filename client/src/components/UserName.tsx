import { Text, TextProps } from '@chakra-ui/react';
import React from 'react';

import { useAuth } from '../modules/auth/store';

interface UserNameProps extends TextProps {
  highlight?: boolean;
  user: {
    id: number;
    name: string;
  };
}

export const getNameText = (name: string) => {
  return name || 'anonymous';
};

const UserName = ({
  highlight = true,
  user: { id, name },
  ...textProps
}: UserNameProps) => {
  const { user } = useAuth();

  return (
    <Text
      data-cy="user-name"
      {...(highlight && user?.id === id && { as: 'mark' })}
      {...textProps}
    >
      {getNameText(name)}
    </Text>
  );
};

export default UserName;
