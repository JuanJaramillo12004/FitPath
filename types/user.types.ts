// Tipos relacionados con los usuarios

export interface User {
  id: string;
  email: string;
  name?: string;
  last_name?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}
