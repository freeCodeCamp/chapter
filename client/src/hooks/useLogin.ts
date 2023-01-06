import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApolloClient } from '@apollo/client';

import { useDevAuth } from '../modules/auth/store/dev';
import { useMeQuery } from 'generated/graphql';
import { useSession } from 'hooks/useSession';

const useDevLogin = () => {
  const { login, logout, isAuthenticated } = useDevAuth();
  return {
    isAuthenticated,
    loginHelper: login,
    logoutHelper: logout,
  };
};

const useAuth0Login = () => {
  const { loginWithPopup, logout, isAuthenticated } = useAuth0();
  return {
    isAuthenticated,
    loginHelper: loginWithPopup,
    logoutHelper: logout,
  };
};

export const useLogin = () => {
  const { loginHelper, logoutHelper, isAuthenticated } =
    process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false'
      ? useAuth0Login()
      : useDevLogin();
  const client = useApolloClient();
  const { createSession, destroySession } = useSession();
  const { refetch } = useMeQuery();

  // Note: this triggers twice whenever isAuthenticated changes.  More reason to
  // handle side effects centrally.
  useEffect(() => {
    if (isAuthenticated) {
      createSession().then(() => refetch());
    } else {
      destroySession()
        .then(() => refetch())
        .then(() => client.resetStore());
    }
  }, [isAuthenticated]);

  const login = async () => {
    await loginHelper();
  };

  const logout = async () => {
    logoutHelper();
  };

  return { login, logout, isAuthenticated };
};
