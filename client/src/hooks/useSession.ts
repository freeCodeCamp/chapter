import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApolloClient } from '@apollo/client';

import { useDevAuth } from '../modules/auth/store/dev';
import { useMeQuery } from 'generated/graphql';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
const needsDevLogin = process.env.NEXT_PUBLIC_USE_AUTH0 === 'false';

const requestSession = (token: string) =>
  fetch(new URL('/login', serverUrl).href, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

const destroySession = () =>
  fetch(new URL('/logout', serverUrl).href, {
    method: 'DELETE',
    credentials: 'include',
  });

const useDevLogin = () => {
  const { login, logout, isAuthenticated } = useDevAuth();
  const createSession = async () => await requestSession('fake-token');

  return {
    isAuthenticated,
    login,
    logout,
    createSession,
    destroySession,
  };
};

const useAuth0Login = () => {
  const { loginWithPopup, logout, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const createSession = async () => {
    const token = await getAccessTokenSilently();
    return requestSession(token);
  };

  return {
    isAuthenticated,
    login: loginWithPopup,
    logout,
    createSession,
    destroySession,
  };
};

export const useSession = () => {
  const { login, logout, isAuthenticated, createSession, destroySession } =
    needsDevLogin ? useDevLogin() : useAuth0Login();
  const client = useApolloClient();
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

  return { createSession, login, logout, isAuthenticated };
};
