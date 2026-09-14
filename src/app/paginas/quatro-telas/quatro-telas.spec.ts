import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuatroTelas } from './quatro-telas';

describe('QuatroTelas', () => {
  let component: QuatroTelas;
  let fixture: ComponentFixture<QuatroTelas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuatroTelas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuatroTelas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
