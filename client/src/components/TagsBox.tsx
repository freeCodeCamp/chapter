import React from 'react';
import { Box, BoxProps, Tag, TagProps } from '@chakra-ui/react';

interface Tags extends TagProps {
  tags: { tag: { name: string } }[];
  boxProps?: BoxProps;
}

export const TagsBox = ({ boxProps, tags, ...tagProps }: Tags) => {
  return (
    <Box data-cy="tags-box" display="flex" alignItems="baseline" {...boxProps}>
      {tags.map(({ tag: { name } }) => (
        <Tag
          borderRadius="full"
          pl="2"
          px="2"
          colorScheme="teal"
          key={name}
          mr="2"
          {...tagProps}
        >
          {name}
        </Tag>
      ))}
    </Box>
  );
};
