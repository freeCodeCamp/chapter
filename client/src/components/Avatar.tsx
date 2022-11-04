import {
  Avatar as ChakraAvatar,
  AvatarProps as ChakraAvatarProps,
} from '@chakra-ui/react';
import React from 'react';

interface AvatarProps extends ChakraAvatarProps {
  user: {
    name: string;
    image_url?: string | null | undefined;
  };
}

const Avatar = ({ user: { name, image_url }, ...avatarProps }: AvatarProps) => {
  return (
    <ChakraAvatar
      name={name}
      src={image_url ?? ''}
      backgroundColor={image_url ? 'transparent' : undefined}
      {...avatarProps}
    />
  );
};

export default Avatar;
