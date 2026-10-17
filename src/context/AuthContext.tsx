import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/auth';
import { 
  loginStudent, 
  registerStudent, 
  logoutStudent, 
  fetchCurrentUser 
} from '../auth/api';

const TOKEN_STORAGE_KEY = 'algomotion_auth_token';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    full_name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        try {
          const profile = await fetchCurrentUser(storedToken);
          setUser(profile);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session expired or invalid, clearing stored credentials.');
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginStudent({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    full_name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await registerStudent(data);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      await logoutStudent(token);
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const profile = await fetchCurrentUser(token);
      setUser(profile);
    } catch {
      // If refresh fails, keep current or logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
