import React, { useContext } from 'react';

type DevAuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const DevAuthContext = React.createContext<DevAuthContextType>({
  isAuthenticated: false,
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
  return (
    <DevAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = () => useContext(DevAuthContext);
