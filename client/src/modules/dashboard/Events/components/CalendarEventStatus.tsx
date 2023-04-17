import { HStack, Spinner, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import React from 'react';

interface CalendarEventStatusProps {
  event: { has_calendar_event: boolean };
  loadingCalendar: boolean;
}

export const CalendarEventStatus = ({
  event: { has_calendar_event },
  loadingCalendar,
}: CalendarEventStatusProps) => {
  return (
    <HStack>
      <Text>Event created in calendar:</Text>
      {loadingCalendar ? (
        <Spinner size="sm" />
      ) : has_calendar_event ? (
        <CheckIcon boxSize="5" />
      ) : (
        <CloseIcon boxSize="4" />
      )}
    </HStack>
  );
};
