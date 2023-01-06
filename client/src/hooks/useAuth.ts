import { useAuth0 } from '@auth0/auth0-react';

import { useDevAuth } from '../modules/auth/store/dev';
import { useMeQuery } from 'generated/graphql';
import { useSession } from 'hooks/useSession';

const useDevLogin = () => {
  const { login, logout } = useDevAuth();
  return {
    loginHelper: login,
    logoutHelper: logout,
  };
};

const useAuth0Login = () => {
  const { loginWithPopup, logout } = useAuth0();
  return {
    loginHelper: loginWithPopup,
    logoutHelper: logout,
  };
};

export const useLogin = () => {
  const { loginHelper, logoutHelper } =
    process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false'
      ? useAuth0Login()
      : useDevLogin();

  const { createSession, destroySession } = useSession();
  const { refetch } = useMeQuery();

  const login = async () => {
    await loginHelper();
    await createSession();
    return await refetch();
  };

  const logout = async () => {
    logoutHelper();
    await destroySession();
    return await refetch();
  };

  return { login, logout };
};
