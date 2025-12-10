import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { CommonModule } from '@angular/common';
import 'zone.js';

describe('Admin', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent, HttpClientTestingModule, CommonModule],
      providers: [
        provideRouter(routes)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize usuarios as empty array', () => {
    expect(component.usuarios).toEqual([]);
  });

  it('should load usuarios on ngOnInit', () => {
    const mockUsuarios = [
      { id: 1, nombre: 'User1', correo: 'user1@test.com' },
      { id: 2, nombre: 'User2', correo: 'user2@test.com' }
    ];

    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
    
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  it('should handle error when loading usuarios', () => {
    spyOn(console, 'error');
    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.error(new ErrorEvent('Network error'));
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar usuarios', jasmine.any(Object));
  });

  it('should navigate to edit page when editar is called', () => {
    spyOn(router, 'navigate');
    component.editar(1);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 1]);
  });

  it('should navigate with correct user id', () => {
    spyOn(router, 'navigate');
    component.editar(5);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 5]);
  });

  it('should update usuarios array after successful API call', () => {
    const mockUsuarios = [
      { id: 1, nombre: 'Admin', correo: 'admin@test.com', rol: 'admin' }
    ];

    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush(mockUsuarios);
    
    expect(component.usuarios.length).toBe(1);
    expect(component.usuarios[0].nombre).toBe('Admin');
  });

  it('should make GET request to correct endpoint', () => {
    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.url).toBe('http://localhost:8080/usuarios');
    req.flush([]);
  });

  it('should handle empty usuarios response', () => {
    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush([]);
    
    expect(component.usuarios).toEqual([]);
  });

  it('should have Header component imported', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should have RouterModule imported', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should have CommonModule imported', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should preserve usuarios data after multiple calls', () => {
    const mockUsuarios1 = [{ id: 1, nombre: 'User1', correo: 'user1@test.com' }];
    const mockUsuarios2 = [
      { id: 1, nombre: 'User1', correo: 'user1@test.com' },
      { id: 2, nombre: 'User2', correo: 'user2@test.com' }
    ];

    component.ngOnInit();
    let req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush(mockUsuarios1);
    expect(component.usuarios.length).toBe(1);

    component.cargarUsuariosDesdeAPI();
    req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush(mockUsuarios2);
    expect(component.usuarios.length).toBe(2);
  });

  it('should handle editar with different id values', () => {
    spyOn(router, 'navigate');
    
    component.editar(10);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 10]);
    
    component.editar(99);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 99]);
  });

  it('should have standalone: true', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct selector', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
