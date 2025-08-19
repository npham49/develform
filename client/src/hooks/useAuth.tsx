import { createContext, useContext, ReactNode } from 'react';
import { authClient } from '../lib/auth';

interface User {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider?: 'github') => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // For now, let's create a simple hook-less implementation until we understand better-auth patterns
  const login = (provider: 'github' = 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/sign-in/social/${provider}?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refetchUser = async () => {
    window.location.reload();
  };

  // Temporary static values - we'll integrate properly once basic flow works
  const user = null;
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}