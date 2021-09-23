import { Button } from '@chakra-ui/button';
import { Checkbox } from '@chakra-ui/checkbox';
import { Stack } from '@chakra-ui/layout';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useSendEventInviteMutation } from 'generated/graphql';

interface SendEmailModalProps {
  onClose: () => any;
  isOpen: boolean;
  eventId: number;
}
const SendEmailModal: React.FC<SendEmailModalProps> = ({
  onClose,
  isOpen,
  eventId,
}) => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const checkAtLeastOne = () => {
    return getValues('confirmed') ||
      getValues('on_waitlist') ||
      getValues('interested')
      ? true
      : 'Please tell me if this is too hard.';
  };

  const [publish] = useSendEventInviteMutation();
  const onSubmit = (data: any) => {
    console.log(data);
    const emailGroups = [];
    for (const key of Object.keys(data)) {
      if (data[key]) {
        emailGroups.push(key);
      }
    }
    console.log(emailGroups);

    publish({ variables: { id: eventId, emailGroups: emailGroups } });
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
                {...register('confirmed', { validate: checkAtLeastOne })}
              >
                Confirmed
              </Checkbox>
              <Checkbox
                {...register('on_waitlist', { validate: checkAtLeastOne })}
              >
                Waitlist
              </Checkbox>
              <Checkbox
                {...register('interested', { validate: checkAtLeastOne })}
                defaultChecked
              >
                Interested
              </Checkbox>
            </Stack>
          </form>
          {Object.keys(errors).length == 3 && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                Please select atleast one checkbox
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button type="submit" variant="solid" form="sendemail">
            Send Email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendEmailModal;
