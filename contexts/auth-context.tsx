import { AuthService } from '@/services';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string, lastName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password);
    setIsAuthenticated(true);
    return result;
  };

  const signUp = async (email: string, password: string, name?: string, lastName?: string) => {
    const result = await AuthService.signUp(email, password, name, lastName);
    setIsAuthenticated(true);
    return result;
  };

  const signOut = async () => {
    await AuthService.signOut();
    setIsAuthenticated(false);
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    await AuthService.updatePassword(newPassword);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refresh: checkAuth,
      }}
    >
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
