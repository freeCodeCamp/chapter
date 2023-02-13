import React from 'react';

import { AuthContext } from './common-context';

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
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, getToken, authError: null }}
    >
      {children}
    </AuthContext.Provider>
  );
};
