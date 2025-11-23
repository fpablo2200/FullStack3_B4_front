import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleResultado } from './detalle-resultado';

describe('DetalleResultado', () => {
  let component: DetalleResultado;
  let fixture: ComponentFixture<DetalleResultado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleResultado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleResultado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
