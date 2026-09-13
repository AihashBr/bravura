import { Component, OnDestroy, OnInit, signal } from '@angular/core';

/**
 * A API de Orientation Lock ainda nao faz parte do lib.dom.d.ts do
 * TypeScript, entao precisa dessa pequena declaracao pra existir.
 */
declare global {
  interface ScreenOrientation {
    lock?(orientacao: string): Promise<void>;
  }
}

/**
 * Bloqueia o conteudo projetado enquanto a tela nao estiver na
 * horizontal. Mesmo comportamento do TelaCheia: reaparece
 * automaticamente se a orientacao voltar pra vertical.
 */
@Component({
  selector: 'app-orientacao-horizontal',
  imports: [],
  templateUrl: './orientacao-horizontal.html',
  styleUrl: './orientacao-horizontal.scss',
})
export class OrientacaoHorizontal implements OnInit, OnDestroy {
  private readonly consulta = window.matchMedia('(orientation: landscape)');

  protected readonly emHorizontal = signal(this.consulta.matches);

  private readonly aoMudar = (): void => this.emHorizontal.set(this.consulta.matches);

  ngOnInit(): void {
    this.consulta.addEventListener('change', this.aoMudar);
  }

  ngOnDestroy(): void {
    this.consulta.removeEventListener('change', this.aoMudar);
  }

  protected aplicar(): void {
    // suporte parcial (ex: nao funciona no Safari/iOS); a mensagem
    // pedindo pra girar o aparelho continua valendo como alternativa
    screen.orientation?.lock?.('landscape').catch(() => {});
  }
}
