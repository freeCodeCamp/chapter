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
import React, { useRef } from 'react';

// Make sure this has no animation because people who use it know what it's so there is no need for attention driven animation.

// interface SettingAlertProps {
//   cancelRef: RefObject<FocusableElement>;
// }

export const AlertDialogExample = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.RefObject<HTMLButtonElement>;

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Customer
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              For Safety, Please Type the name of the Chapter.
              <Input
                variant="outline"
                errorBorderColor="crimson"
                size="md"
                isRequired
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
