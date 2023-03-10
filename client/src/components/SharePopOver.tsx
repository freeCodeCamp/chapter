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
import { CopyIcon } from '@chakra-ui/icons';

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
          colorScheme={'blue'}
          size={size}
          leftIcon={<CopyIcon />}
        >
          Copy URL
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
