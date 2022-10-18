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
  size?: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          onClick={() => navigator.clipboard.writeText(link)}
          colorScheme={'blue'}
          size={size}
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Link copied to clipboard!
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
