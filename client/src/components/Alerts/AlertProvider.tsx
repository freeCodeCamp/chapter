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
    setAlerts(({ alertList: alertsList, nextId }) => ({
      alertList: alertsList.filter(({ alertId }) => alertId !== idToRemove),
      nextId,
    }));
  };

  const addAlert = (alert: Omit<AlertProps, 'alertId'>) => {
    setAlerts(({ alertList: alertsList, nextId }) => ({
      alertList: [...alertsList, { ...alert, alertId: nextId }],
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
