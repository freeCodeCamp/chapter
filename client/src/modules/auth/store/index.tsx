import React, { createContext, useContext, useEffect, useState } from 'react';

import { useMeQuery, MeQuery } from '../../../generated/graphql';
import { useSession } from 'hooks/useSession';

interface AuthContextType {
  user?: MeQuery['me'];
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

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<AuthContextType>({});
  const [loginAttempted, setLoginAttempted] = useState(false);
  const { loading, error, data: meData, refetch } = useMeQuery();
  const { isAuthenticated, createSession } = useSession();

  const tryToCreateSession = async () => {
    if (isAuthenticated) {
      setLoginAttempted(true);
      await createSession();
      refetch();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      if (meData?.me) {
        setData({ user: meData.me });
      } else if (!loginAttempted) {
        // TODO: figure out if we need this guard. Can we get away with only
        // using isAuthenticated?
        tryToCreateSession();
      }
    }
  }, [loading, error, meData, loginAttempted, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ data, setData }}>
      {children}
    </AuthContext.Provider>
  );
};
