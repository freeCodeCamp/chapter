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
  alertId: number;
  description?: string;
  descriptionProps?: AlertDescriptionProps;
  iconProps?: AlertIconProps;
  titleProps?: AlertTitleProps;
  closeButtonProps?: CloseButtonProps;
}

type AlertContextType = {
  alertList: AlertProps[];
  removeAlert: (idToRemove: number) => void;
  addAlert: (alert: Omit<AlertProps, 'alertId'>) => void;
};

export const AlertContext = React.createContext<AlertContextType>({
  alertList: [],
  removeAlert: () => {},
  addAlert: () => {},
});
