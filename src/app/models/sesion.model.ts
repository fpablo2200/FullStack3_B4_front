export interface Sesion {
  logueado: boolean;
  usuario: string;
  correo: string;
  rol: 'ADMIN' | 'USER';
}
