import React, { useContext } from 'react';

type DevAuthContextType = {
  login: () => void;
  logout: () => void;
};

const DevAuthContext = React.createContext<DevAuthContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

export const DevAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const login = () => localStorage.setItem('dev-login-authenticated', 'true');
  const logout = () => localStorage.removeItem('dev-login-authenticated');
  return (
    <DevAuthContext.Provider value={{ login, logout }}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => useContext(DevAuthContext);
