import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoPular } from './botao-pular';

describe('BotaoPular', () => {
  let component: BotaoPular;
  let fixture: ComponentFixture<BotaoPular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoPular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoPular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
