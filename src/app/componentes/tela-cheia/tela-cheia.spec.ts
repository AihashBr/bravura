import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaCheia } from './tela-cheia';

describe('TelaCheia', () => {
  let component: TelaCheia;
  let fixture: ComponentFixture<TelaCheia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaCheia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaCheia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
