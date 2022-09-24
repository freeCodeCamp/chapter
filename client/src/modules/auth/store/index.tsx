import React, { createContext, useContext, useEffect, useState } from 'react';

import { MeQuery, useMeQuery } from '../../../generated/graphql';
import { useSession } from 'hooks/useSession';

interface AuthContextType {
  user?: MeQuery['me'];
}

export const AuthContext = createContext<{
  data: AuthContextType;
}>({
  data: {},
});

export const useAuthStore = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext).data;

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<AuthContextType>({});
  const { loading, error, data: meData, refetch } = useMeQuery();
  const { isAuthenticated, createSession } = useSession();

  const tryToCreateSession = async () => {
    if (isAuthenticated) {
      const { status } = await createSession();
      if (status === 200) refetch();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      if (meData) setData({ user: meData.me });
      // If there is no user data, either the user doesn't have a session or
      // they don't exist. Since we can't tell the difference, we have to try to
      // create a session.
      if (!meData?.me) tryToCreateSession();
    }
  }, [loading, error, meData, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        data,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
