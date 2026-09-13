import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientacaoHorizontal } from './orientacao-horizontal';

describe('OrientacaoHorizontal', () => {
  let component: OrientacaoHorizontal;
  let fixture: ComponentFixture<OrientacaoHorizontal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrientacaoHorizontal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrientacaoHorizontal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
