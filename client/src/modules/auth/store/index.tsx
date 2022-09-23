import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAuth0 } from '@auth0/auth0-react';
import { MeQuery, useMeQuery } from '../../../generated/graphql';
import { useSession } from 'hooks/useSession';

interface AuthContextType {
  user?: MeQuery['me'];
}

export const AuthContext = createContext<{
  data: AuthContextType;
  refetchData: () => void;
  login: () => void;
}>({
  data: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetchData: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => {},
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
  const { loginWithRedirect } = useAuth0();

  const login = () => {
    if (process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false') {
      loginWithRedirect();
    } else {
      createSession().then(() => refetch());
    }
  };

  const tryToCreateSession = async () => {
    if (isAuthenticated) {
      setLoginAttempted(true);
      await createSession();
      refetch();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      if (meData) {
        setData({ user: meData.me });
      } else if (!loginAttempted) {
        // TODO: figure out if we need this guard. Can we get away with only
        // using isAuthenticated?
        tryToCreateSession();
      }
    }
  }, [loading, error, meData, loginAttempted, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        data,
        refetchData: refetch,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
