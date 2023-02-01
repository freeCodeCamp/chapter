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
    authError,
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
  // isAuthenticated does not change immediately after login/logout, so we
  // need to track the intent to prevent accidental session creation/deletion
  const [toLogout, setToLogout] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = async () => {
    setError(null);
    await loginAuth();
    setCanAlterSession(true);
    setToLogout(false);
  };
  const logout = async () => {
    setError(null);
    await logoutAuth();
    setCanAlterSession(true);
    setToLogout(true);
  };

  useEffect(() => {
    if (!canAlterSession) return;
    setCanAlterSession(false);

    if (toLogout) {
      destroySession()
        .then((res) => {
          if (!res.ok) throw Error(`Server returned ${res.status} error.`);
        })
        .then(() => refetch())
        .then(() => apollo.resetStore())
        .catch((e) => setError(e));
    } else if (isAuthenticated) {
      createSession()
        .then((res) => {
          if (!res.ok) throw Error(`Server returned ${res.status} error.`);
        })
        .then(() => refetch())
        .catch((e) => setError(e));
    }
  }, [isAuthenticated, canAlterSession, toLogout]);

  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);
  return { login, logout, isAuthenticated, error };
};
