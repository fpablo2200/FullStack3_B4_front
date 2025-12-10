export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: 'ADMIN' | 'USER';
  estado: '0' | '1';
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface LoginResponse {
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMIN' | 'USER';
}
