import React, { useState } from 'react';

import { AlertContext, AlertProps } from './AlertContext';

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<{
    alertList: AlertProps[];
    nextId: number;
  }>({
    alertList: [],
    nextId: 0,
  });

  const removeAlert = (idToRemove: number) => {
    setAlerts(({ alertList, nextId }) => ({
      alertList: alertList.filter(({ alertId }) => alertId !== idToRemove),
      nextId,
    }));
  };

  const addAlert = (alert: Omit<AlertProps, 'alertId'>) => {
    setAlerts(({ alertList, nextId }) => ({
      alertList: [...alertList, { ...alert, alertId: nextId }],
      nextId: ++nextId,
    }));
  };

  return (
    <AlertContext.Provider
      value={{ alertList: alerts.alertList, removeAlert, addAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};
