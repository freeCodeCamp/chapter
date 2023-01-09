export type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string>;
};
