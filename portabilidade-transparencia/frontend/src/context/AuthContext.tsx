import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  authenticated: boolean;
  token: string | null;
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("jwt");
  });

  const loginWithToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("jwt", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwt");
  };

  const value: AuthContextType = {
    authenticated: !!token,
    token,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
