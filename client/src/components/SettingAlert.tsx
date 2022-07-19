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
  buttonCallToAction: React.ReactNode;
  inputPlaceholder?: string;
  refFunction(): React.RefObject<HTMLButtonElement>;
}

export const AlertDialogExample = (props: SettingAlertProps) => {
  const { buttonCallToAction, refFunction, title, inputPlaceholder } = props;
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
              For Safety, Please Type the name of the Chapter.
              <Input
                variant="outline"
                errorBorderColor="crimson"
                size="md"
                placeholder={inputPlaceholder}
                isRequired
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              {buttonCallToAction}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
