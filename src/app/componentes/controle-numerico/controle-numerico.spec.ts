import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleNumerico } from './controle-numerico';

describe('ControleNumerico', () => {
  let component: ControleNumerico;
  let fixture: ComponentFixture<ControleNumerico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleNumerico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleNumerico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
