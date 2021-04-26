import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMeQuery } from '../../../generated/graphql';

interface AuthContextType {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export const AuthContext = createContext<{
  data: AuthContextType;
  setData: React.Dispatch<React.SetStateAction<AuthContextType>>;
}>({
  data: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData: () => {},
});

export const useAuthStore = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext).data;

export const AuthContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthContextType>({});
  const meQuery = useMeQuery();

  useEffect(() => {
    if (!meQuery.loading && !meQuery.error) {
      if (meQuery.data?.me) {
        setData({ user: meQuery.data?.me });
      }
    }
  }, [meQuery.loading, meQuery.error, meQuery.data]);

  return (
    <AuthContext.Provider value={{ data, setData }}>
      {children}
    </AuthContext.Provider>
  );
};
