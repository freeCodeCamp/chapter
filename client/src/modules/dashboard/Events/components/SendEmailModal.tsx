import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  Checkbox,
  Stack,
  useToast,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/modal';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSendEventInviteMutation } from 'generated/graphql';
interface SendEmailModalProps {
  onClose: () => any;
  isOpen: boolean;
  eventId: number;
}
interface FormInputs {
  confirmed: boolean;
  on_waitlist: boolean;
  canceled: boolean;
}
const SendEmailModal: React.FC<SendEmailModalProps> = ({
  onClose,
  isOpen,
  eventId,
}) => {
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ defaultValues: { confirmed: true } });

  const atLeastOneChecked: () => boolean = () => {
    return (
      getValues('confirmed') ||
      getValues('on_waitlist') ||
      getValues('canceled')
    );
  };

  const [publish] = useSendEventInviteMutation();
  const toast = useToast();

  const onSubmit = async (data: FormInputs) => {
    const emailGroups = [];
    if (data.confirmed) {
      emailGroups.push('confirmed');
    }
    if (data.canceled) {
      emailGroups.push('canceled');
    }
    if (data.on_waitlist) {
      emailGroups.push('on_waitlist');
    }
    setLoading(true);
    await publish({ variables: { eventId, emailGroups } });
    setLoading(false);
    toast({ title: 'Email sent', status: 'success' });
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Email to Attendees</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="sendemail" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="attendees">
              Who do you want to send the email to?
            </label>
            <Stack spacing={10} direction="row">
              <Checkbox
                {...register('confirmed', { validate: atLeastOneChecked })}
              >
                Confirmed
              </Checkbox>
              <Checkbox
                {...register('on_waitlist', { validate: atLeastOneChecked })}
              >
                Waitlist
              </Checkbox>
              <Checkbox
                {...register('canceled', { validate: atLeastOneChecked })}
              >
                Canceled
              </Checkbox>
            </Stack>
          </form>
          {Object.keys(errors).length == 3 && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                Please select at least one checkbox
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            colorScheme={'blue'}
            variant="solid"
            form="sendemail"
            isLoading={isLoading}
            loadingText="Sending"
          >
            Send Email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendEmailModal;
