import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultadoService } from './resultado';

describe('ResultadoService', () => {
  let service: ResultadoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:9090/resultados';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultadoService]
    });
    service = TestBed.inject(ResultadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Initialization', () => {
    it('debe crearse', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('obtenerResultados()', () => {
    it('debe obtener todos los resultados', () => {
      const mockResultados: any[] = [
        { idResultado: 1, tipoAnalisis: 'Hemograma', estado: 'VALIDADO' },
        { idResultado: 2, tipoAnalisis: 'Perfil lipídico', estado: 'ENTREGADO' }
      ];

      service.obtenerResultados().subscribe((resultados: any[]) => {
        expect(resultados.length).toBe(2);
        expect(resultados).toEqual(mockResultados);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResultados);
    });

    it('debe manejar resultados vacíos', () => {
      service.obtenerResultados().subscribe((resultados: any[]) => {
        expect(resultados).toEqual([]);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });
  });

  describe('obtenerPorId()', () => {
    it('debe obtener un resultado específico por ID', () => {
      const resultadoId = 1;
      const mockResultado: any = {
        idResultado: 1,
        idExamen: 'EXA001',
        tipoAnalisis: 'Hemograma completo',
        estado: 'VALIDADO'
      };

      service.obtenerPorId(resultadoId).subscribe((resultado: any) => {
        expect(resultado).toEqual(mockResultado);
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResultado);
    });

    it('debe devolver un resultado con el ID correcto', () => {
      const resultadoId = 5;
      const mockResultado: any = {
        idResultado: 5,
        tipoAnalisis: 'Prueba específica',
        estado: 'VALIDADO'
      };

      service.obtenerPorId(resultadoId).subscribe((resultado: any) => {
        expect(resultado.idResultado).toBe(5);
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      req.flush(mockResultado);
    });
  });

  describe('crear()', () => {
    it('debe crear un nuevo resultado', () => {
      const nuevoResultado: any = {
        idExamen: 'EXA005',
        tipoAnalisis: 'Prueba de función hepática',
        laboratorio: 'Lab Test',
        valoresResultado: 'Normal',
        observaciones: 'Sin observaciones',
        estado: 'PENDIENTE'
      };
      const mockResponse: any = { idResultado: 5, ...nuevoResultado };

      service.crear(nuevoResultado).subscribe((resultado: any) => {
        expect(resultado.idResultado).toBe(5);
        expect(resultado.tipoAnalisis).toBe('Prueba de función hepática');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoResultado);
      req.flush(mockResponse);
    });

    it('debe enviar los datos correctos en la solicitud POST', () => {
      const data: any = {
        idExamen: 'EXA010',
        tipoAnalisis: 'Test',
        laboratorio: 'Test Lab',
        valoresResultado: 'Test Values',
        observaciones: 'Test Obs',
        estado: 'PENDIENTE'
      };

      service.crear(data).subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.body).toEqual(data);
      req.flush({ idResultado: 10, ...data });
    });
  });

  describe('actualizar()', () => {
    it('debe actualizar un resultado existente', () => {
      const resultadoId = 1;
      const datosActualizados: any = {
        tipoAnalisis: 'Hemograma completo actualizado',
        estado: 'ENTREGADO'
      };
      const mockResponse: any = { idResultado: resultadoId, ...datosActualizados };

      service.actualizar(resultadoId, datosActualizados).subscribe((resultado: any) => {
        expect(resultado.idResultado).toBe(resultadoId);
        expect(resultado.estado).toBe('ENTREGADO');
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(datosActualizados);
      req.flush(mockResponse);
    });

    it('debe manejar actualizaciones parciales', () => {
      const resultadoId = 3;
      const parcialData: any = { estado: 'VALIDADO' };

      service.actualizar(resultadoId, parcialData).subscribe((resultado: any) => {
        expect(resultado.estado).toBe('VALIDADO');
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      expect(req.request.body).toEqual(parcialData);
      req.flush({ idResultado: resultadoId, ...parcialData });
    });
  });

  describe('eliminarResultado()', () => {
    it('debe eliminar un resultado', () => {
      const resultadoId = 1;

      service.eliminarResultado(resultadoId).subscribe(() => {
        expect(true).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('debe manejar la respuesta de eliminación', () => {
      const resultadoId = 2;

      service.eliminarResultado(resultadoId).subscribe((response: any) => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      req.flush({ message: 'Resultado eliminado' });
    });

    it('debe hacer la solicitud DELETE a la URL correcta', () => {
      const resultadoId = 7;

      service.eliminarResultado(resultadoId).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/${resultadoId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
