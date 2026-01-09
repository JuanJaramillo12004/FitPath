// Tipos relacionados con las estadísticas diarias

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  distance: number;
  calories: number;
  created_at: string;
  updated_at: string;
}
