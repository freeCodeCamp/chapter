import { useAuth0 } from '@auth0/auth0-react';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

// TODO: figure out how to create a proper separation between auth0 and the dev
// login.  How about creating two providers and conditionally wrapping the rest
// of the site in one or the other?
const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

export const useLogin = (): {
  isAuthenticated: boolean;
  login: () => Promise<void>;
} => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const login = async () => {
    const token = isDev ? 'fake-token' : await getAccessTokenSilently();

    await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  };
  return { isAuthenticated: isDev ? true : isAuthenticated, login };
};
