// Tipos relacionados con los recorridos

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  date: string;
  distance: number; // en kilómetros
  duration: number; // en minutos
  route: RoutePoint[];
  created_at: string;
  updated_at: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  altitude?: number;
}
