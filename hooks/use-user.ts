import { UserService } from '@/services';
import { User } from '@/types/database.types';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error cargando usuario:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedUser = await UserService.updateProfile(updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const getFullName = () => {
    return user ? UserService.getFullName(user) : '';
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    refresh: loadUser,
    updateProfile,
    getFullName,
  };
}
