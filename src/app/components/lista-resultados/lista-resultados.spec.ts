import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaResultadoComponent } from './lista-resultados';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { routes } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { ResultadoService } from '../../services/resultado';
import { of, throwError, Subject } from 'rxjs';

describe('ListaResultadoComponent', () => {
  let component: ListaResultadoComponent;
  let fixture: ComponentFixture<ListaResultadoComponent>;
  let resultadoService: ResultadoService;
  let router: Router;

  const mockResultados = [
    {
      idResultado: 1,
      idExamen: '123',
      tipoAnalisis: 'Sangre',
      laboratorio: 'Lab Central',
      valoresResultado: 'Normal',
      observaciones: 'Sin observaciones',
      fechaResultado: '2025-01-01',
      estado: 'VALIDADO'
    },
    {
      idResultado: 2,
      idExamen: '456',
      tipoAnalisis: 'Orina',
      laboratorio: 'Lab Norte',
      valoresResultado: 'Anormal',
      observaciones: 'Revisar',
      fechaResultado: '2025-01-02',
      estado: 'PENDIENTE'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadoComponent, HttpClientTestingModule, CommonModule],
      providers: [
        provideRouter(routes),
        ResultadoService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadoComponent);
    component = fixture.componentInstance;
    resultadoService = TestBed.inject(ResultadoService);
    router = TestBed.inject(Router);
    
    spyOn(resultadoService, 'obtenerResultados').and.returnValue(of(mockResultados));
  });

  it('debe crearse', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe tener el array resultados inicializado', () => {
    fixture.detectChanges();
    expect(component.resultados).toBeDefined();
    expect(Array.isArray(component.resultados)).toBeTrue();
  });

  it('debe cargar resultados en ngOnInit', () => {
    fixture.detectChanges();
    expect(resultadoService.obtenerResultados).toHaveBeenCalled();
    expect(component.resultados.length).toBe(2);
    expect(component.cargando).toBeFalse();
  });

  it('debe establecer error cuando la carga falla', () => {
    (resultadoService.obtenerResultados as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    
    expect(component.error).toBe('Error al cargar resultados.');
    expect(component.cargando).toBeFalse();
  });

  it('debe llamar al método cargarResultados', () => {
    spyOn(component, 'cargarResultados').and.callThrough();
    component.ngOnInit();
    expect(component.cargarResultados).toHaveBeenCalled();
  });

  it('debe abrir el modal con el id correcto', () => {
    fixture.detectChanges();
    component.abrirModal(1);
    
    expect(component.mostrarModal).toBeTrue();
    expect(component.idSeleccionado).toBe(1);
  });

  it('debe cancelar el modal y resetear idSeleccionado', () => {
    fixture.detectChanges();
    component.abrirModal(1);
    component.cancelar();
    
    expect(component.mostrarModal).toBeFalse();
    expect(component.idSeleccionado).toBeNull();
  });

  it('debe confirmar la eliminación y filtrar resultados', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    component.idSeleccionado = 1;
    
    spyOn(resultadoService, 'eliminarResultado').and.returnValue(of({}));
    
    component.confirmarEliminacion();
    
    expect(resultadoService.eliminarResultado).toHaveBeenCalledWith(1);
    expect(component.resultados.length).toBe(1);
    expect(component.mostrarModal).toBeFalse();
  });

  it('debe establecer error cuando la eliminación falla', () => {
    fixture.detectChanges();
    component.idSeleccionado = 1;
    
    spyOn(resultadoService, 'eliminarResultado').and.returnValue(throwError(() => new Error('Error')));
    
    component.confirmarEliminacion();
    
    expect(component.error).toBe('No se pudo eliminar el registro.');
    expect(component.mostrarModal).toBeFalse();
  });

  it('no debe eliminar si idSeleccionado es null', () => {
    fixture.detectChanges();
    component.idSeleccionado = null;
    
    spyOn(resultadoService, 'eliminarResultado');
    
    component.confirmarEliminacion();
    
    expect(resultadoService.eliminarResultado).not.toHaveBeenCalled();
  });

  it('debe navegar a la página de edición', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate');
    
    component.editar(1);
    
    expect(router.navigate).toHaveBeenCalledWith(['/detalle-resultado', 1]);
  });

  it('debe llamar ngOnDestroy y completar destroy$', () => {
    fixture.detectChanges();
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('debe mostrar las columnas correctas en la tabla', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const headers = compiled.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('debe renderizar el div results-card', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('.results-card');
    expect(card).toBeTruthy();
  });

  it('debe renderizar la tabla con la clase responsive', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const tableContainer = compiled.querySelector('.table-responsive');
    expect(tableContainer).toBeTruthy();
  });

  it('debe manejar el método eliminar con confirmación', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.eliminar(1);
    
    expect(component.resultados.length).toBe(1);
    expect(component.resultados[0].idResultado).toBe(2);
  });

  it('no debe eliminar si la confirmación es cancelada', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.eliminar(1);
    
    expect(component.resultados.length).toBe(2);
  });
});
