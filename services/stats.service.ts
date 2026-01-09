import { DailyStats } from '@/types/database.types';
import { supabase } from './supabase';

export class StatsService {
  // Obtener las estadísticas del día actual
  static async getTodayStats(): Promise<DailyStats | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }

    return data;
  }

  // Actualizar las estadísticas del día actual
  static async updateTodayStats(stats: Partial<Omit<DailyStats, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>): Promise<DailyStats> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const today = new Date().toISOString().split('T')[0];

    // Intentar actualizar primero
    const { data: existing } = await supabase
      .from('daily_stats')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (existing) {
      // Actualizar registro existente
      const { data, error } = await supabase
        .from('daily_stats')
        .update(stats)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando estadísticas:', error);
        throw error;
      }

      return data;
    } else {
      // Crear nuevo registro
      const { data, error } = await supabase
        .from('daily_stats')
        .insert({
          user_id: user.id,
          date: today,
          steps: 0,
          distance: 0,
          calories: 0,
          ...stats,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creando estadísticas:', error);
        throw error;
      }

      return data;
    }
  }

  // Obtener estadísticas de un rango de fechas
  static async getStatsRange(startDate: string, endDate: string): Promise<DailyStats[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }

    return data || [];
  }
}
