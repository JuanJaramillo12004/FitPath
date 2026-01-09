import { supabase } from './supabase';

export class AuthService {
  // Registrar un nuevo usuario
  static async signUp(email: string, password: string, name?: string, lastName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.error('Error en registro:', error);
      throw error;
    }

    return data;
  }

  // Iniciar sesión
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    }

    return data;
  }

  // Cerrar sesión
  static async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }

  // Recuperar contraseña
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Error recuperando contraseña:', error);
      throw error;
    }
  }

  // Actualizar contraseña
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error actualizando contraseña:', error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  static async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  // Obtener el usuario autenticado actual
  static async getCurrentAuthUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error obteniendo usuario autenticado:', error);
      throw error;
    }

    return user;
  }
}
