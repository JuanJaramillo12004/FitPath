-- Script SQL para crear las tablas en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

-- Crear tabla de usuarios (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  last_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de recorridos
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  route JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de estadísticas diarias
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS trips_date_idx ON public.trips(date);
CREATE INDEX IF NOT EXISTS daily_stats_user_id_idx ON public.daily_stats(user_id);
CREATE INDEX IF NOT EXISTS daily_stats_date_idx ON public.daily_stats(date);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Políticas de seguridad para recorridos
CREATE POLICY "Los usuarios pueden ver sus propios recorridos"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios recorridos"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios recorridos"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios recorridos"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas de seguridad para estadísticas diarias
CREATE POLICY "Los usuarios pueden ver sus propias estadísticas"
  ON public.daily_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propias estadísticas"
  ON public.daily_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias estadísticas"
  ON public.daily_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear automáticamente un registro de usuario cuando se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'last_name',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Función para sincronizar email cuando cambia en auth.users
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para sincronizar email automáticamente
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_user_email();
