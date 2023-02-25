import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AlertContext } from './AlertContext';

export const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  console.log(alerts);

  return (
    <>
      {alerts.map(
        (
          {
            status,
            title,
            closeButtonProps,
            description,
            descriptionProps,
            iconProps,
            titleProps,
            ...rest
          },
          index,
        ) => (
          <Alert key={index} status={status} {...rest}>
            <AlertIcon {...iconProps} />
            <AlertTitle {...titleProps}>{title}</AlertTitle>
            {description && (
              <AlertDescription {...descriptionProps}>
                {description}
              </AlertDescription>
            )}
            <CloseButton
              onClick={() => removeAlert(index)}
              {...closeButtonProps}
            />
          </Alert>
        ),
      )}
    </>
  );
};
