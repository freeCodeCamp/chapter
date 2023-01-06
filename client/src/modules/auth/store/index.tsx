import React, { createContext, useContext, useEffect, useState } from 'react';

import { MeQuery, useMeQuery } from '../../../generated/graphql';
import { useSession } from 'hooks/useSession';
import { useLogin } from 'hooks/useAuth';

export interface AuthContextType {
  user?: MeQuery['me'];
  loadingUser: boolean;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<{
  data: AuthContextType;
}>({
  data: { loadingUser: true, isLoggedIn: false },
});

export const useAuth = () => useContext(AuthContext).data;

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<AuthContextType>({
    loadingUser: true,
    isLoggedIn: false,
  });
  const { loading: loadingMe, error, data: meData, refetch } = useMeQuery();
  const { createSession } = useSession();
  const { isAuthenticated } = useLogin();

  const tryToCreateSession = async () => {
    if (isAuthenticated) {
      const { status } = await createSession();
      if (status === 200) refetch();
    }
  };

  useEffect(() => {
    if (!loadingMe && !error) {
      if (meData)
        setData({
          user: meData.me,
          loadingUser: false,
          isLoggedIn: !!meData.me,
        });
      // If there is no user data, either the user doesn't have a session or
      // they don't exist. Since we can't tell the difference, we have to try to
      // create a session.
      if (!meData?.me) tryToCreateSession();
    }
  }, [loadingMe, error, meData, isAuthenticated]);

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
