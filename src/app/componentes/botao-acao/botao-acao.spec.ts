import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoAcao } from './botao-acao';

describe('BotaoAcao', () => {
  let component: BotaoAcao;
  let fixture: ComponentFixture<BotaoAcao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoAcao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoAcao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
