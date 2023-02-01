/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string>;
  authError: Error | null;
};

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  getToken: () => Promise.resolve(''),
  authError: null,
});
