import { useDevAuth, DevAuthProvider } from './providers/dev';
import {
  useAuth as useAuth0,
  AuthProvider as Auth0Provider,
} from './providers/auth0';

const needsDevLogin = process.env.NEXT_PUBLIC_USE_AUTH0 === 'false';

export const AuthProvider = needsDevLogin ? DevAuthProvider : Auth0Provider;
export const useAuth = () => (needsDevLogin ? useDevAuth() : useAuth0());
