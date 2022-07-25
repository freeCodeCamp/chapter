import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { useMeQuery, MeQuery } from '../../../generated/graphql';

interface AuthContextType {
  user?: MeQuery['me'];
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const tryToLogin = async () => {
    // TODO: this shouldn't have to know about Auth0. It should be a separate
    // function that makes the request
    if (!isAuthenticated) return;
    setLoginAttempted(true);

    const token = await getAccessTokenSilently();

    const response = await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const responseData = await response.json();
    console.log('tried to login', responseData);
    if (!loginAttempted) {
      console.log('refetching');
      refetch();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      if (meData?.me) {
        setData({ user: meData.me });
      } else if (!loginAttempted) {
        // TODO: figure out if we need this guard. Is the loginAttempted check in tryToLogin enough?
        // can we get away with only using isAuthenticated?
        tryToLogin();
      }
    }
  }, [loading, error, meData, loginAttempted, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ data, setData }}>
      {children}
    </AuthContext.Provider>
  );
};
