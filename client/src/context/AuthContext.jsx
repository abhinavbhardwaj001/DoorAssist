import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "../services/auth.api";

import {
  setAccessToken,
  clearAccessToken,
  subscribeToSessionExpired,
} from "../services/tokenStore";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return subscribeToSessionExpired(() => {
      setUser(null);
    });
  }, []);

  // Restore session when application loads
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const response = await refreshToken();

        if (!active) return;

        setAccessToken(response.data.data.accessToken);

        const userResponse = await getCurrentUser();

        if (active) {
          setUser(userResponse.data.data.user);
        }
      } catch {
        if (active) {
          clearAccessToken();
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Login
  const login = useCallback(async (credentials) => {
    const response = await loginUser(credentials);

    setAccessToken(response.data.data.accessToken);
    setUser(response.data.data.user);

    return response.data;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      setUser,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
