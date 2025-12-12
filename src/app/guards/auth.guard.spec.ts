import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test-url' } as RouterStateSnapshot;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse', () => {
    expect(authGuard).toBeTruthy();
  });

  it('debe devolver true si el usuario está logueado', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('debe devolver false si el usuario no está logueado', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBeFalse();
  });

  it('debe redirigir a /login si el usuario no está logueado', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(false);

    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe llamar al método estaLogueado', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);

    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(authService.estaLogueado).toHaveBeenCalled();
  });

  it('debe manejar múltiples llamadas correctamente', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);

    const result1 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );
    const result2 = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result1).toBeTrue();
    expect(result2).toBeTrue();
    expect(authService.estaLogueado).toHaveBeenCalledTimes(2);
  });

  it('debe funcionar con distintos snapshots de ruta', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);
    
    const route1 = { params: { id: '1' } } as any as ActivatedRouteSnapshot;
    const route2 = { params: { id: '2' } } as any as ActivatedRouteSnapshot;

    const result1 = TestBed.runInInjectionContext(() => 
      authGuard(route1, mockState)
    );
    const result2 = TestBed.runInInjectionContext(() => 
      authGuard(route2, mockState)
    );

    expect(result1).toBeTrue();
    expect(result2).toBeTrue();
  });

  it('debe funcionar con diferentes URLs de estado', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(false);
    
    const state1 = { url: '/admin' } as RouterStateSnapshot;
    const state2 = { url: '/user' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, state1)
    );
    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, state2)
    );

    expect(router.navigate).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
