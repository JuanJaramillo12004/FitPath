import { Trip } from '@/types/database.types';
import { supabase } from './supabase';

export class TripService {
  // Obtener todos los recorridos del usuario actual
  static async getTrips(): Promise<Trip[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error obteniendo recorridos:', error);
      throw error;
    }

    return data || [];
  }

  // Crear un nuevo recorrido
  static async createTrip(trip: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Trip> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('trips')
      .insert({
        ...trip,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creando recorrido:', error);
      throw error;
    }

    return data;
  }

  // Actualizar un recorrido existente
  static async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando recorrido:', error);
      throw error;
    }

    return data;
  }

  // Eliminar un recorrido
  static async deleteTrip(id: string): Promise<void> {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando recorrido:', error);
      throw error;
    }
  }

  // Obtener un recorrido por ID
  static async getTripById(id: string): Promise<Trip | null> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo recorrido:', error);
      return null;
    }

    return data;
  }
}
