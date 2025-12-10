import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleResultado } from './detalle-resultado';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetalleResultado', () => {
  let component: DetalleResultado;
  let fixture: ComponentFixture<DetalleResultado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleResultado, HttpClientTestingModule],
      providers: [
        provideRouter(routes),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'  // Simula /detalle-resultado/1
              }
            }
          }
        }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(DetalleResultado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
