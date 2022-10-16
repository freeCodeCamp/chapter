import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/popover';
import { Button } from '@chakra-ui/button';

export const ShareEventPop = ({ link }: { link: string }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          onClick={() => navigator.clipboard.writeText(link)}
          colorScheme={'blue'}
          size="sm"
        >
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          You have copied the link below into your clipboard!
        </PopoverHeader>
        <PopoverBody>{link}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
