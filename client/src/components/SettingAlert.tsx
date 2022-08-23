import {
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
} from '@chakra-ui/react';
import React from 'react';

interface SettingAlertProps {
  title: string;
  DialogBody: string;
  children?: React.ReactNode;
  inputPlaceholder?: string;
}

export const SettingAlertDialog = (props: SettingAlertProps) => {
  const { title, DialogBody, children, inputPlaceholder } = props;

  return (
    <>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {DialogBody}
            <Input
              variant="outline"
              errorBorderColor="red.300"
              size="md"
              placeholder={inputPlaceholder}
              pattern={inputPlaceholder}
              isRequired
            />
          </AlertDialogBody>

          <AlertDialogFooter>{children}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </>
  );
};
