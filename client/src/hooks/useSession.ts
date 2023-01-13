import { useEffect } from 'react';
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
  const { getToken, login, logout, isAuthenticated } = useAuth();
  const createSession = async () => {
    const token = await getToken();
    return requestSession(token);
  };
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
