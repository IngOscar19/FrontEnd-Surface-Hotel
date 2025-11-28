export interface CreateUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'admin' | 'user';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}