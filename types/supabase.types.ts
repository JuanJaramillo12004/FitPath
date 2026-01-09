import { DailyStats } from './stats.types';
import { Trip } from './trip.types';
import { User } from './user.types';

// Tipos para las respuestas de Supabase
export type Database = {
  public: {
    Tables: {
      trips: {
        Row: Trip;
        Insert: Omit<Trip, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Trip, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      daily_stats: {
        Row: DailyStats;
        Insert: Omit<DailyStats, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DailyStats, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
