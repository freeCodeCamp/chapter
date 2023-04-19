import { Button, ButtonProps } from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import React from 'react';
import { InfoIcon } from '@chakra-ui/icons';

import { Event } from '../../../../generated/graphql';
import { useCancelEvent } from '../../../../hooks/useCancelEvent';

interface EventCancelButtonProps {
  size?: ButtonProps['size'];
  buttonText: string;
  event: Pick<Event, 'id' | 'canceled'>;
  isDisabled?: boolean;
}

const EventCancelButton = (props: EventCancelButtonProps) => {
  const {
    isDisabled = false,
    buttonText,
    event: { id: eventId },
    ...rest
  } = props;
  const cancel = useCancelEvent();

  const confirmCancel = useConfirm({
    title: 'Cancel this event?',
    body: (
      <>
        <InfoIcon boxSize={5} /> Canceling event will send notification to
        subscribed attendees.
      </>
    ),
    buttonText: 'Cancel event',
    buttonColor: 'orange',
  });

  const clickCancel = async () => {
    const ok = await confirmCancel();
    if (ok) {
      await cancel({ eventId });
    }
  };
  return (
    <Button {...rest} onClick={clickCancel} isDisabled={isDisabled}>
      {buttonText}
    </Button>
  );
};

export default EventCancelButton;
