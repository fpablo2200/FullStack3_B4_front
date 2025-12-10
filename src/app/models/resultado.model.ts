export interface Resultado {
  idResultado?: number;
  idExamen: string;
  tipoAnalisis: string;
  laboratorio: string;
  valoresResultado: string;
  observaciones?: string;
  fechaResultado: string;
  estado: 'VALIDADO' | 'ENTREGADO' | 'PENDIENTE';
}
