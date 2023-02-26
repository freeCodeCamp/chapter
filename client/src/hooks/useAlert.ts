import React from 'react';

import { AlertContext, AlertProps } from '../components/Alerts/AlertContext';

export const useAlert = () => {
  const { addAlert } = React.useContext(AlertContext);
  return (alert: Omit<AlertProps, 'alertId'>) => addAlert(alert);
};
