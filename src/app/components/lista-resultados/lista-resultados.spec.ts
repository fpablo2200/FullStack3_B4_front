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

  const mockResultados: any[] = [
    {
      idResultado: 1,
      idExamen: '123',
      tipoAnalisis: 'Sangre',
      laboratorio: 'Lab Central',
      valoresResultado: 'Normal',
      observaciones: 'Sin observaciones',
      fechaResultado: '2025-01-01',
      estado: 'VALIDADO' as const
    },
    {
      idResultado: 2,
      idExamen: '456',
      tipoAnalisis: 'Orina',
      laboratorio: 'Lab Norte',
      valoresResultado: 'Anormal',
      observaciones: 'Revisar',
      fechaResultado: '2025-01-02',
      estado: 'PENDIENTE' as const
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

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have resultados array initialized', () => {
    fixture.detectChanges();
    expect(component.resultados).toBeDefined();
    expect(Array.isArray(component.resultados)).toBeTrue();
  });

  it('should load resultados on init', () => {
    fixture.detectChanges();
    expect(resultadoService.obtenerResultados).toHaveBeenCalled();
    expect(component.resultados.length).toBe(2);
    expect(component.cargando).toBeFalse();
  });

  it('should set error when loading fails', () => {
    (resultadoService.obtenerResultados as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    
    expect(component.error).toBe('Error al cargar resultados.');
    expect(component.cargando).toBeFalse();
  });

  it('should call cargarResultados method', () => {
    spyOn(component, 'cargarResultados').and.callThrough();
    component.ngOnInit();
    expect(component.cargarResultados).toHaveBeenCalled();
  });

  it('should open modal with correct id', () => {
    fixture.detectChanges();
    component.abrirModal(1);
    
    expect(component.mostrarModal).toBeTrue();
    expect(component.idSeleccionado).toBe(1);
  });

  it('should cancel modal and reset idSeleccionado', () => {
    fixture.detectChanges();
    component.abrirModal(1);
    component.cancelar();
    
    expect(component.mostrarModal).toBeFalse();
    expect(component.idSeleccionado).toBeNull();
  });

  it('should confirm elimination and filter resultados', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    component.idSeleccionado = 1;
    
    spyOn(resultadoService, 'eliminarResultado').and.returnValue(of(void 0));
    
    component.confirmarEliminacion();
    
    expect(resultadoService.eliminarResultado).toHaveBeenCalledWith(1);
    expect(component.resultados.length).toBe(1);
    expect(component.mostrarModal).toBeFalse();
  });

  it('should set error when elimination fails', () => {
    fixture.detectChanges();
    component.idSeleccionado = 1;
    
    spyOn(resultadoService, 'eliminarResultado').and.returnValue(throwError(() => new Error('Error')));
    
    component.confirmarEliminacion();
    
    expect(component.error).toBe('No se pudo eliminar el registro.');
    expect(component.mostrarModal).toBeFalse();
  });

  it('should not eliminate if idSeleccionado is null', () => {
    fixture.detectChanges();
    component.idSeleccionado = null;
    
    spyOn(resultadoService, 'eliminarResultado');
    
    component.confirmarEliminacion();
    
    expect(resultadoService.eliminarResultado).not.toHaveBeenCalled();
  });

  it('should navigate to edit page', () => {
    fixture.detectChanges();
    spyOn(router, 'navigate');
    
    component.editar(1);
    
    expect(router.navigate).toHaveBeenCalledWith(['/detalle-resultado', 1]);
  });

  it('should call ngOnDestroy and complete destroy$', () => {
    fixture.detectChanges();
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should display correct columns in the table', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const headers = compiled.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('should render the results-card div', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('.results-card');
    expect(card).toBeTruthy();
  });

  it('should render table with responsive class', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const tableContainer = compiled.querySelector('.table-responsive');
    expect(tableContainer).toBeTruthy();
  });

  it('should handle eliminar method with confirm', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    
    spyOn(window, 'confirm').and.returnValue(true);
    
    component.eliminar(1);
    
    expect(component.resultados.length).toBe(1);
    expect(component.resultados[0].idResultado).toBe(2);
  });

  it('should not eliminate if confirm is cancelled', () => {
    fixture.detectChanges();
    component.resultados = [...mockResultados];
    
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.eliminar(1);
    
    expect(component.resultados.length).toBe(2);
  });
});
