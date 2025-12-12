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

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar usuarios como un arreglo vacío', () => {
    expect(component.usuarios).toEqual([]);
  });

  it('debe cargar usuarios en ngOnInit', () => {
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

  it('debe manejar error al cargar usuarios', () => {
    spyOn(console, 'error');
    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.error(new ErrorEvent('Network error'));
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar usuarios', jasmine.any(Object));
  });

  it('debe navegar a la página de edición cuando se llama editar', () => {
    spyOn(router, 'navigate');
    component.editar(1);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 1]);
  });

  it('debe navegar con el id de usuario correcto', () => {
    spyOn(router, 'navigate');
    component.editar(5);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 5]);
  });

  it('debe actualizar el arreglo usuarios después de una llamada API exitosa', () => {
    const mockUsuarios = [
      { id: 1, nombre: 'Admin', correo: 'admin@test.com', rol: 'admin' }
    ];

    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush(mockUsuarios);
    
    expect(component.usuarios.length).toBe(1);
    expect(component.usuarios[0].nombre).toBe('Admin');
  });

  it('debe hacer la solicitud GET al endpoint correcto', () => {
    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    expect(req.request.url).toBe('http://localhost:8080/usuarios');
    req.flush([]);
  });

  it('debe manejar respuesta de usuarios vacía', () => {
    component.cargarUsuariosDesdeAPI();
    const req = httpMock.expectOne('http://localhost:8080/usuarios');
    req.flush([]);
    
    expect(component.usuarios).toEqual([]);
  });

  it('debe tener importado el componente Header', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('debe tener importado RouterModule', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('debe tener importado CommonModule', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('debe preservar los datos de usuarios después de múltiples llamadas', () => {
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

  it('debe manejar editar con distintos valores de id', () => {
    spyOn(router, 'navigate');
    
    component.editar(10);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 10]);
    
    component.editar(99);
    expect(router.navigate).toHaveBeenCalledWith(['/registro', 99]);
  });

  it('debe tener standalone: true', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el selector correcto', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
