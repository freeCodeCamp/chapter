import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { useAuth } from '../modules/auth/context';
import { useMeQuery } from 'generated/graphql';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

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

export const useSession = () => {
  const {
    getToken,
    login: loginAuth,
    logout: logoutAuth,
    isAuthenticated,
  } = useAuth();
  const createSession = async () => {
    const token = await getToken();
    return requestSession(token);
  };
  const apollo = useApolloClient();
  const { refetch } = useMeQuery();
  // Until the user initiates a login or logout, we don't want to create or
  // destroy a session
  const [canAlterSession, setCanAlterSession] = useState(false);

  const login = async () => {
    await loginAuth();
    setCanAlterSession(true);
  };
  const logout = async () => {
    await logoutAuth();
    setCanAlterSession(true);
  };

  useEffect(() => {
    if (!canAlterSession) return;
    setCanAlterSession(false);

    if (isAuthenticated) {
      createSession().then(() => refetch());
    } else {
      destroySession()
        .then(() => refetch())
        .then(() => apollo.resetStore());
    }
  }, [isAuthenticated, canAlterSession]);

  return { createSession, login, logout, isAuthenticated };
};
