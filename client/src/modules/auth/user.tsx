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
  const { loading: loadingMe, error, data: meData } = useMeQuery();
  const { logout, isAuthenticated } = useSession();

  useEffect(() => {
    if (!loadingMe && !error && meData) {
      setData({
        user: meData.me,
        loadingUser: false,
        isLoggedIn: !!meData.me,
      });
    } else if (error) {
      setData({ loadingUser: false, isLoggedIn: false });
      logout();
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
