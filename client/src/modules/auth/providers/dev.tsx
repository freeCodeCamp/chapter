import React, { useContext } from 'react';

import { AuthContextType } from './common-types';

const DevAuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getToken: () => Promise.resolve(''),
});

export const DevAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    typeof window !== 'undefined' &&
      !!localStorage.getItem('dev-login-authenticated'),
  );
  const login = () => {
    localStorage.setItem('dev-login-authenticated', 'true');
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('dev-login-authenticated');
    setIsAuthenticated(false);
  };
  const getToken = () => Promise.resolve('fake-token');
  return (
    <DevAuthContext.Provider
      value={{ isAuthenticated, login, logout, getToken }}
    >
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => useContext(DevAuthContext);
