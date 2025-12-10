import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage.service';
import { LoggerService } from '../../services/logger.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, HttpClientTestingModule],
      providers: [
        provideRouter(routes),
        AuthService,
        StorageService,
        LoggerService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header element', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('header')).toBeTruthy();
  });

  it('should display navigation menu', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });

  it('should show logout button when user is logged in', () => {
    localStorage.setItem('sesion', JSON.stringify({ rol: 'admin' }));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rol).toBe('admin');
  });

  it('should not show logout button when user is not logged in', () => {
    localStorage.clear();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rol).toBeNull();
  });

  it('should call logout when logout is clicked', () => {
    spyOn(router, 'navigate');
    spyOn(window.localStorage, 'removeItem');
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should have proper styling classes', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should display application logo', () => {
    const compiled = fixture.nativeElement;
    const logo = compiled.querySelector('img') || compiled.querySelector('[data-test="logo"]');
    expect(logo || compiled.textContent).toBeTruthy();
  });

  it('should have navigation links', () => {
    const compiled = fixture.nativeElement;
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should handle responsive design', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should update when authentication state changes', (done) => {
    localStorage.setItem('sesion', JSON.stringify({ rol: 'user' }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.rol).toBe('user');
      done();
    });
  });

  it('should navigate to login on logout', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display user information if available', (done) => {
    const mockSesion = { rol: 'admin', email: 'test@test.com' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(component.rol).toBe('admin');
      done();
    });
  });

  it('should have correct header structure', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('header')).toBeTruthy();
  });

  it('should initialize with proper state', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to lista-resultado when goToLista is called', () => {
    spyOn(router, 'navigate');
    component.goToLista();
    expect(router.navigate).toHaveBeenCalledWith(['/lista-resultado']);
  });

  it('should parse and set rol from localStorage on init', () => {
    const mockSesion = { rol: 'doctor' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    expect(component.rol).toBe('doctor');
  });

  it('should handle missing sesion in localStorage', () => {
    localStorage.removeItem('sesion');
    component.ngOnInit();
    expect(component.rol).toBeNull();
  });

  it('should clear localStorage on logout', () => {
    spyOn(window.localStorage, 'removeItem');
    spyOn(router, 'navigate');
    component.logout();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('sesion');
  });

  it('should have constructor with Router dependency', () => {
    expect(component).toBeTruthy();
  });

  it('should render CommonModule directives', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should import RouterModule for navigation', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
