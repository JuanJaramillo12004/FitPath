import { User } from '@/types/database.types';
import { supabase } from './supabase';

/**
 * Servicio para gestionar los usuarios
 */
export class UserService {
  /**
   * Obtener el perfil del usuario actual
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }

    return data;
  }

  /**
   * Actualizar el perfil del usuario actual
   */
  static async updateProfile(updates: Partial<Omit<User, 'id' | 'email' | 'created_at' | 'updated_at'>>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }

    return data;
  }

  /**
   * Obtener el nombre completo del usuario
   */
  static getFullName(user: User): string {
    const parts = [];
    if (user.name) parts.push(user.name);
    if (user.last_name) parts.push(user.last_name);
    return parts.length > 0 ? parts.join(' ') : user.email;
  }
}
