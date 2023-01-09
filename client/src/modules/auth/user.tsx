import React, { createContext, useContext, useEffect, useState } from 'react';

import { MeQuery, useMeQuery } from '../../generated/graphql';
import { useSession } from '../../hooks/useSession';

export interface UserContextType {
  user?: MeQuery['me'];
  loadingUser: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<{
  data: UserContextType;
}>({
  data: { loadingUser: true, isLoggedIn: false },
});

export const useUser = () => useContext(UserContext).data;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<UserContextType>({
    loadingUser: true,
    isLoggedIn: false,
  });
  const { loading: loadingMe, error, data: meData, refetch } = useMeQuery();
  const { isAuthenticated, createSession } = useSession();

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
    <UserContext.Provider
      value={{
        data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
