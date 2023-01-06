import { useAuth0 } from '@auth0/auth0-react';
import { useMeQuery } from 'generated/graphql';
import { useSession } from 'hooks/useSession';

export const useLogin = () => {
  const { loginWithPopup } = useAuth0();
  const { createSession } = useSession();
  const { refetch } = useMeQuery();

  const loginHelper =
    process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false'
      ? loginWithPopup
      : () => localStorage.setItem('dev-login-authenticated', 'true');

  const login = async () => {
    await loginHelper();
    await createSession();
    return await refetch();
  };

  return login;
};

export const useLogout = () => {
  const { logout: logoutAuth0 } = useAuth0();
  const { destroySession } = useSession();
  const { refetch } = useMeQuery();

  const logoutHelper =
    process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false'
      ? logoutAuth0
      : () => localStorage.removeItem('dev-login-authenticated');

  const logout = async () => {
    logoutHelper();
    await destroySession();
    return await refetch();
  };

  return logout;
};
