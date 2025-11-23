import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResultadoComponent } from './lista-resultados';

describe('ListaResultadoComponent', () => {
  let component: ListaResultadoComponent;
  let fixture: ComponentFixture<ListaResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
