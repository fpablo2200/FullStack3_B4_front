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

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true if user is logged in', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return false if user is not logged in', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(result).toBeFalse();
  });

  it('should redirect to /login if user is not logged in', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(false);

    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call estaLogueado method', () => {
    spyOn(authService, 'estaLogueado').and.returnValue(true);

    TestBed.runInInjectionContext(() => 
      authGuard(mockRoute, mockState)
    );

    expect(authService.estaLogueado).toHaveBeenCalled();
  });

  it('should handle multiple calls correctly', () => {
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

  it('should work with different route snapshots', () => {
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

  it('should work with different state URLs', () => {
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
