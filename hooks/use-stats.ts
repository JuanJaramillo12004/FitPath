import { StatsService } from '@/services';
import { DailyStats } from '@/types/database.types';
import { useEffect, useState } from 'react';

export function useDailyStats() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StatsService.getTodayStats();
      setStats(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (updates: Partial<Omit<DailyStats, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedStats = await StatsService.updateTodayStats(updates);
      setStats(updatedStats);
      return updatedStats;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
    updateStats,
  };
}
