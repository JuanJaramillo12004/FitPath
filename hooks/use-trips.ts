import { TripService } from '@/services';
import { Trip } from '@/types/database.types';
import { useEffect, useState } from 'react';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TripService.getTrips();
      setTrips(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error cargando recorridos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTrip = await TripService.createTrip(trip);
      setTrips([newTrip, ...trips]);
      return newTrip;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      const updatedTrip = await TripService.updateTrip(id, updates);
      setTrips(trips.map(trip => trip.id === id ? updatedTrip : trip));
      return updatedTrip;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      await TripService.deleteTrip(id);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return {
    trips,
    loading,
    error,
    refresh: loadTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}
