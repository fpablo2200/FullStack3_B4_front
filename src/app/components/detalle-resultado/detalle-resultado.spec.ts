import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleResultado } from './detalle-resultado';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ResultadoService } from '../../services/resultado';

describe('DetalleResultado', () => {
  let component: DetalleResultado;
  let fixture: ComponentFixture<DetalleResultado>;
  let resultadoService: ResultadoService;
  let router: Router;

  const mockResultado = {
    idExamen: '123',
    tipoAnalisis: 'Sangre',
    laboratorio: 'Lab Central',
    valoresResultado: 'Normal',
    observaciones: 'Sin observaciones',
    fechaResultado: '2025-01-01',
    estado: 'VALIDADO'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleResultado, HttpClientTestingModule],
      providers: [
        provideRouter(routes),
        ResultadoService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(DetalleResultado);
    component = fixture.componentInstance;
    resultadoService = TestBed.inject(ResultadoService);
    router = TestBed.inject(Router);
  });

  it('debe crearse', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con validadores', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    expect(component.detalleForm).toBeDefined();
    expect(component.detalleForm.get('idExamen')).toBeTruthy();
    expect(component.detalleForm.get('tipoAnalisis')).toBeTruthy();
    expect(component.detalleForm.get('laboratorio')).toBeTruthy();
  });

  it('debe cargar datos cuando se proporciona id', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    
    expect(resultadoService.obtenerPorId).toHaveBeenCalledWith(1);
    expect(component.isEdit).toBeTrue();
    expect(component.editingId).toBe(1);
    expect(component.cargando).toBeFalse();
  });

  it('debe establecer error cuando la carga falla', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    
    expect(component.error).toBe('No se pudo cargar el resultado.');
    expect(component.cargando).toBeFalse();
  });

  it('no debe llamar obtenerPorId cuando no se proporciona id', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue(null);
    spyOn(resultadoService, 'obtenerPorId');
    
    component.ngOnInit();
    
    expect(resultadoService.obtenerPorId).not.toHaveBeenCalled();
    expect(component.isEdit).toBeFalse();
    expect(component.cargando).toBeFalse();
  });

  it('no debe enviar el formulario si es inválido', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    
    component.detalleForm.patchValue({
      idExamen: '',
      tipoAnalisis: '',
      laboratorio: ''
    });
    
    spyOn(resultadoService, 'crear');
    component.guardar();
    
    expect(resultadoService.crear).not.toHaveBeenCalled();
    expect(component.detalleForm.touched).toBeTrue();
  });

  it('debe llamar actualizar cuando está en modo edición', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    
    component.isEdit = true;
    component.editingId = 1;
    component.detalleForm.patchValue(mockResultado);
    
    spyOn(resultadoService, 'actualizar').and.returnValue(of({}));
    spyOn(router, 'navigate');
    
    component.guardar();
    
    expect(resultadoService.actualizar).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/lista-resultado']);
  });

  it('debe establecer error cuando actualizar falla', () => {
    spyOn(resultadoService, 'obtenerPorId').and.returnValue(of(mockResultado));
    fixture.detectChanges();
    
    component.isEdit = true;
    component.editingId = 1;
    component.detalleForm.patchValue(mockResultado);
    
    spyOn(resultadoService, 'actualizar').and.returnValue(throwError(() => new Error('Error')));
    
    component.guardar();
    
    expect(component.error).toBe('Error al actualizar.');
  });


});
