import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTestes } from './menu-testes';

describe('MenuTestes', () => {
  let component: MenuTestes;
  let fixture: ComponentFixture<MenuTestes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuTestes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTestes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
