import { Button, ButtonProps } from '@chakra-ui/react';
import { useConfirm } from 'chakra-confirm';
import React from 'react';
import { Event, useCancelEventMutation } from '../../../../generated/graphql';
import { EVENT, EVENTS } from '../graphql/queries';

interface EventCancelButtonProps extends ButtonProps {
  isFullWidth?: boolean;
  buttonText: string;
  event: Pick<Event, 'id' | 'canceled'>;
}

const EventCancelButton: React.FC<EventCancelButtonProps> = (props) => {
  const { isFullWidth, buttonText, event, ...rest } = props;

  const [cancel] = useCancelEventMutation();

  const confirmCancel = useConfirm({
    title: 'Are you sure you want to cancel this',
    body: 'Canceling this will send emails to everyone who RSVPd',
    buttonColor: 'orange',
  });

  const data = {
    variables: { id: event.id },
    refetchQueries: [
      { query: EVENT, variables: { id: event.id } },
      { query: EVENTS },
    ],
  };

  const clickCancel = async () => {
    const ok = await confirmCancel();
    if (ok) {
      await cancel(data);
    }
  };
  return (
    <Button
      {...rest}
      isFullWidth={isFullWidth}
      colorScheme="orange"
      onClick={clickCancel}
    >
      {buttonText}
    </Button>
  );
};

export default EventCancelButton;
