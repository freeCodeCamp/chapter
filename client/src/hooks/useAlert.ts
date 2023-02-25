import React from 'react';

import {
  AlertContext,
  AlertProps,
} from '../components/PageLayout/component/AlertContext';

export const useAlert = () => {
  const { addAlert } = React.useContext(AlertContext);
  return (alert: AlertProps) => addAlert(alert);
};
