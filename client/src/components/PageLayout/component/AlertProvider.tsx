import React, { useState } from 'react';

import { AlertContext, AlertProps } from './AlertContext';

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const removeAlert = (indexToRemove: number) => {
    setAlerts((alerts) => alerts.filter((_, index) => index !== indexToRemove));
  };

  const addAlert = (alert: AlertProps) => {
    setAlerts((alerts) => [...alerts, alert]);
  };

  return (
    <AlertContext.Provider value={{ alerts, removeAlert, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
