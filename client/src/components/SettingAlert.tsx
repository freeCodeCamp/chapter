import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import React from 'react';

// Make sure this has no animation because people who use it know what it's so there is no need for attention driven animation.

interface SettingAlertProps {
  title?: string;
  DialogBody?: string;
  children?: React.ReactNode;
  inputPlaceholder?: string;
  refFunction(): React.RefObject<HTMLButtonElement>;
}

export const SettingAlertDialog = (props: SettingAlertProps) => {
  const { title, DialogBody, children, inputPlaceholder, refFunction } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = refFunction();

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        {title}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>
              {DialogBody}
              {/* Make sure that the Chapter name people see, is the same of what they are expected to input */}
              <Input
                variant="outline"
                errorBorderColor="crimson"
                size="md"
                placeholder={inputPlaceholder}
                isRequired
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} mr={3}>
                Cancel
              </Button>
              {children}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
