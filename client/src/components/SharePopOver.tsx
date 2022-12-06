import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/popover';
import { Button } from '@chakra-ui/button';

export const SharePopOver = ({
  link,
  size,
}: {
  link: string;
  size?: string | string[];
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          onClick={() => navigator.clipboard.writeText(link)}
          background="gray.85"
          color="gray.10"
          _hover={{ color: 'gray.85', backgroundColor: 'gray.10' }}
          _focusVisible={{
            outlineColor: 'blue.600',
            outlineOffset: '1px',
            boxShadow: 'none',
          }}
          size={size}
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>Link copied to clipboard!</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
