import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaResultadoComponent } from './lista-resultados';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { CommonModule } from '@angular/common';

describe('ListaResultadoComponent', () => {
  let component: ListaResultadoComponent;
  let fixture: ComponentFixture<ListaResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadoComponent, HttpClientTestingModule, CommonModule],
      providers: [
        provideRouter(routes)
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadoComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have resultados array initialized', () => {
    expect(component.resultados).toBeDefined();
    expect(Array.isArray(component.resultados)).toBeTrue();
  });


  it('should display correct columns in the table', () => {
    const compiled = fixture.nativeElement;
    const headers = compiled.querySelectorAll('th');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('should have estado field for each result', () => {
    component.resultados.forEach(resultado => {
      expect(resultado.estado).toBeDefined();
      expect(['VALIDADO', 'ENTREGADO', 'PENDIENTE']).toContain(resultado.estado);
    });
  });

  it('should render the results-card div', () => {
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('.results-card');
    expect(card).toBeTruthy();
  });

  it('should render table with responsive class', () => {
    const compiled = fixture.nativeElement;
    const tableContainer = compiled.querySelector('.table-responsive');
    expect(tableContainer).toBeTruthy();
  });

  it('should contain valoresResultado field', () => {
    component.resultados.forEach(resultado => {
      expect(resultado.valoresResultado).toBeDefined();
    });
  });

  it('should contain observaciones field', () => {
    component.resultados.forEach(resultado => {
      expect(resultado.observaciones).toBeDefined();
    });
  });
});
