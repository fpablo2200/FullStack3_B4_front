import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('debe crearse', () => {
      expect(service).toBeTruthy();
    });

    it('debe inicializar sesion$ como observable', (done) => {
      service.sesion$.subscribe(sesion => {
        expect(sesion).toBeNull();
        done();
      });
    });
  });

  describe('getSesion()', () => {
    it('debe devolver null cuando no hay sesion en localStorage', () => {
      const result = service.getSesion();
      expect(result).toBeNull();
    });

    it('debe devolver los datos de sesion desde localStorage', () => {
      const mockSesion = { logueado: true, usuario: 'Test User', rol: 'USER' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.getSesion();
      expect(result).toEqual(mockSesion);
    });

    it('debe parsear correctamente JSON desde localStorage', () => {
      const mockSesion = { logueado: true, usuario: 'John Doe', rol: 'ADMIN', correo: 'john@example.com' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.getSesion();
      expect(result.usuario).toBe('John Doe');
      expect(result.correo).toBe('john@example.com');
    });
  });

  describe('estaLogueado()', () => {
    it('debe devolver false cuando no existe sesion', () => {
      const result = service.estaLogueado();
      expect(result).toBeFalse();
    });

    it('debe devolver true cuando sesion.logueado es true', () => {
      const mockSesion = { logueado: true, usuario: 'Test User' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.estaLogueado();
      expect(result).toBeTrue();
    });

    it('debe devolver false cuando sesion.logueado es false', () => {
      const mockSesion = { logueado: false, usuario: 'Test User' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.estaLogueado();
      expect(result).toBeFalse();
    });
  });

  describe('esAdmin()', () => {
    it('debe devolver false cuando no existe sesion', () => {
      const result = service.esAdmin();
      expect(result).toBeFalse();
    });

    it('debe devolver true cuando sesion.rol es ADMIN', () => {
      const mockSesion = { logueado: true, usuario: 'Admin User', rol: 'ADMIN' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.esAdmin();
      expect(result).toBeTrue();
    });

    it('debe devolver false cuando sesion.rol no es ADMIN', () => {
      const mockSesion = { logueado: true, usuario: 'Regular User', rol: 'USER' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      const result = service.esAdmin();
      expect(result).toBeFalse();
    });
  });

  describe('iniciarSesion()', () => {
    it('debe guardar la sesion en localStorage', () => {
      const mockSesion = { logueado: true, usuario: 'Test User', rol: 'USER' };
      
      service.iniciarSesion(mockSesion);
      
      const storedSesion = JSON.parse(localStorage.getItem('sesion') || '{}');
      expect(storedSesion).toEqual(mockSesion);
    });

    it('debe emitir datos de sesion a través del observable sesion$', (done) => {
      const mockSesion = { logueado: true, usuario: 'Test User', rol: 'USER' };
      
      service.sesion$.subscribe(sesion => {
        if (sesion?.usuario === 'Test User') {
          expect(sesion).toEqual(mockSesion);
          done();
        }
      });
      
      service.iniciarSesion(mockSesion);
    });
  });

  describe('cerrarSesion()', () => {
    it('debe eliminar la sesion de localStorage', () => {
      const mockSesion = { logueado: true, usuario: 'Test User' };
      localStorage.setItem('sesion', JSON.stringify(mockSesion));
      
      service.cerrarSesion();
      
      expect(localStorage.getItem('sesion')).toBeNull();
    });

  });

  describe('login()', () => {
    it('debe hacer una solicitud POST con las credenciales', () => {
      const credentials = { correo: 'test@example.com', password: 'password123' };
      
      service.login(credentials).subscribe();
      
      const req = httpMock.expectOne('http://localhost:8080/usuarios/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush({ id: 1, nombre: 'Test', apellido: 'User' });
    });

    it('debe devolver datos de usuario en login exitoso', () => {
      const credentials = { correo: 'test@example.com', password: 'password123' };
      const mockResponse = { id: 1, nombre: 'Test', apellido: 'User', correo: 'test@example.com' };
      
      service.login(credentials).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });
      
      const req = httpMock.expectOne('http://localhost:8080/usuarios/login');
      req.flush(mockResponse);
    });
  });

  describe('verificarCorreo()', () => {
    it('debe hacer una solicitud GET para verificar el correo', () => {
      const email = 'test@example.com';
      
      service.verificarCorreo(email).subscribe();
      
      const req = httpMock.expectOne(req => req.url.includes('verificar-correo'));
      expect(req.request.method).toBe('GET');
      req.flush({ existe: false });
    });

    it('debe devolver el estado de existencia', () => {
      const email = 'existing@example.com';
      
      service.verificarCorreo(email).subscribe(result => {
        expect(result.existe).toBeTrue();
      });
      
      const req = httpMock.expectOne(req => req.url.includes('verificar-correo'));
      req.flush({ existe: true });
    });
  });

  describe('registrarUsuario()', () => {
    it('debe hacer una solicitud POST con los datos del usuario', () => {
      const userData = { nombre: 'John', apellido: 'Doe', correo: 'john@example.com', password: 'pass123' };
      
      service.registrarUsuario(userData).subscribe();
      
      const req = httpMock.expectOne('http://localhost:8080/usuarios');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush({ id: 1, ...userData });
    });
  });

  describe('obtenerUsuario()', () => {
    it('debe hacer una solicitud GET para un usuario específico', () => {
      const userId = 1;
      
      service.obtenerUsuario(userId).subscribe();
      
      const req = httpMock.expectOne(`http://localhost:8080/usuarios/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush({ id: 1, nombre: 'Test', apellido: 'User' });
    });

    it('debe devolver los datos del usuario', () => {
      const userId = 1;
      const mockUser = { id: 1, nombre: 'John', apellido: 'Doe', correo: 'john@example.com' };
      
      service.obtenerUsuario(userId).subscribe(result => {
        expect(result).toEqual(mockUser);
      });
      
      const req = httpMock.expectOne(`http://localhost:8080/usuarios/${userId}`);
      req.flush(mockUser);
    });
  });

  describe('actualizarUsuario()', () => {
    it('debe hacer una solicitud PUT con los datos del usuario', () => {
      const userId = 1;
      const userData = { nombre: 'Updated', apellido: 'Name' };
      
      service.actualizarUsuario(userId, userData).subscribe();
      
      const req = httpMock.expectOne(`http://localhost:8080/usuarios/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(userData);
      req.flush({ id: userId, ...userData });
    });

    it('debe devolver los datos actualizados del usuario', () => {
      const userId = 1;
      const userData = { nombre: 'Updated', apellido: 'Name' };
      const mockResponse = { id: userId, ...userData };
      
      service.actualizarUsuario(userId, userData).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });
      
      const req = httpMock.expectOne(`http://localhost:8080/usuarios/${userId}`);
      req.flush(mockResponse);
    });
  });
});
