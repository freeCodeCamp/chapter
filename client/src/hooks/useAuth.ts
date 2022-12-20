import { useAuth0 } from '@auth0/auth0-react';
import { useMeQuery } from 'generated/graphql';
import { useSession } from 'hooks/useSession';

export const useLogin = () => {
  const { loginWithPopup, isAuthenticated } = useAuth0();
  const { createSession } = useSession();
  const { refetch } = useMeQuery();

  const login = async () => {
    if (process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false')
      await loginWithPopup(undefined, { timeoutInSeconds: 400 });

    if (isAuthenticated) {
      await createSession();
      return await refetch();
    }
    return;
  };

  return login;
};

export const useLogout = () => {
  const { logout: logoutAuth0 } = useAuth0();
  const { destroySession } = useSession();
  const { refetch } = useMeQuery();

  const logout = async () => {
    if (process.env.NEXT_PUBLIC_USE_AUTH0 !== 'false') logoutAuth0();
    await destroySession();
    return await refetch();
  };

  return logout;
};
