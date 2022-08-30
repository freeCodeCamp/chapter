import {
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import React from 'react';

interface SettingAlertProps {
  title: string;
  DialogBody: string;
  children?: React.ReactNode;
}

export const SettingAlertDialog = (props: SettingAlertProps) => {
  const { title, DialogBody, children } = props;

  return (
    <>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{DialogBody}</AlertDialogBody>

          <AlertDialogFooter>{children}</AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </>
  );
};
