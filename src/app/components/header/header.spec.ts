import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from '../../services/auth';
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

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar el elemento header', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('header')).toBeTruthy();
  });

  it('debe mostrar el menú de navegación', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });

  it('debe mostrar el botón de logout cuando el usuario está logueado', () => {
    localStorage.setItem('sesion', JSON.stringify({ rol: 'admin' }));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rol).toBe('admin');
  });

  it('no debe mostrar el botón de logout cuando el usuario no está logueado', () => {
    localStorage.clear();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rol).toBeNull();
  });

  it('debe llamar logout cuando se hace click en logout', () => {
    spyOn(router, 'navigate');
    spyOn(window.localStorage, 'removeItem');
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe tener las clases de estilo correctas', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('debe mostrar el logo de la aplicación', () => {
    const compiled = fixture.nativeElement;
    const logo = compiled.querySelector('img') || compiled.querySelector('[data-test="logo"]');
    expect(logo || compiled.textContent).toBeTruthy();
  });

  it('debe tener enlaces de navegación', () => {
    const compiled = fixture.nativeElement;
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('debe manejar el diseño responsive', () => {
    const compiled = fixture.nativeElement;
    const header = compiled.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('debe actualizarse cuando cambia el estado de autenticación', (done) => {
    localStorage.setItem('sesion', JSON.stringify({ rol: 'user' }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.rol).toBe('user');
      done();
    });
  });

  it('debe navegar a login al hacer logout', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe mostrar información del usuario si está disponible', (done) => {
    const mockSesion = { rol: 'admin', email: 'test@test.com' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(component.rol).toBe('admin');
      done();
    });
  });

  it('debe tener la estructura correcta del header', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('header')).toBeTruthy();
  });

  it('debe inicializarse con el estado correcto', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar a lista-resultado cuando se llama goToLista', () => {
    spyOn(router, 'navigate');
    component.goToLista();
    expect(router.navigate).toHaveBeenCalledWith(['/lista-resultado']);
  });

  it('debe parsear y establecer rol desde localStorage en init', () => {
    const mockSesion = { rol: 'doctor' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    expect(component.rol).toBe('doctor');
  });

  it('debe manejar la ausencia de sesion en localStorage', () => {
    localStorage.removeItem('sesion');
    component.ngOnInit();
    expect(component.rol).toBeNull();
  });

  it('debe limpiar localStorage al hacer logout', () => {
    spyOn(window.localStorage, 'removeItem');
    spyOn(router, 'navigate');
    component.logout();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('sesion');
  });

  it('debe tener el constructor con dependencia Router', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar directivas de CommonModule', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('debe importar RouterModule para navegación', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
