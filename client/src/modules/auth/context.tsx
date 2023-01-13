import { useContext } from 'react';

import { DevAuthProvider } from './providers/dev';
import { AuthProvider as Auth0Provider } from './providers/auth0';
import { AuthContext } from './providers/common-context';

const needsDevLogin = process.env.NEXT_PUBLIC_USE_AUTH0 === 'false';

export const AuthProvider = needsDevLogin ? DevAuthProvider : Auth0Provider;
export const useAuth = () => useContext(AuthContext);
