import { useAuth0 } from '@auth0/auth0-react';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const useLogin = (): {
  isAuthenticated: boolean;
  login: () => Promise<void>;
} => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const login = async () => {
    const token = await getAccessTokenSilently();

    await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  };
  return { isAuthenticated, login };
};
