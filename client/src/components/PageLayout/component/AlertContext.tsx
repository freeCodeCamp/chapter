/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import {
  AlertProps as ChakraAlertProps,
  AlertDescriptionProps,
  AlertIconProps,
  AlertTitleProps,
  CloseButtonProps,
} from '@chakra-ui/react';

export interface AlertProps extends ChakraAlertProps {
  description?: string;
  descriptionProps?: AlertDescriptionProps;
  iconProps?: AlertIconProps;
  titleProps?: AlertTitleProps;
  closeButtonProps?: CloseButtonProps;
}

type AlertContextType = {
  alerts: AlertProps[];
  removeAlert: (indexToRemove: number) => void;
  addAlert: (alert: AlertProps) => void;
};

export const AlertContext = React.createContext<AlertContextType>({
  alerts: [],
  removeAlert: () => {},
  addAlert: () => {},
});
