import { Component, inject, output } from '@angular/core';
import { Preferencias } from '../../servicos/preferencias';

const ID_ELEMENTO = 'botao-pular';
const LAYOUT_PADRAO = { x: 85, y: 78, escala: 1 };
const ESCALA_MINIMA = 0.5;
const ESCALA_MAXIMA = 2;

/**
 * Botao de pular na tela (touch/mouse). Posicao e escala vem do
 * layout salvo em Preferencias — fica fixo no canto ate o jogador
 * usar o modo de edicao de layout pra mover/redimensionar.
 */
@Component({
  selector: 'app-botao-pular',
  imports: [],
  templateUrl: './botao-pular.html',
  styleUrl: './botao-pular.scss',
})
export class BotaoPular {
  private readonly preferencias = inject(Preferencias);

  protected readonly layout = this.preferencias.obterLayoutElemento(ID_ELEMENTO, LAYOUT_PADRAO);
  protected readonly modoEdicao = this.preferencias.modoEdicaoLayout;

  readonly pular = output<void>();

  protected aoPressionar(evento: PointerEvent): void {
    if (this.modoEdicao()) {
      this.iniciarArraste(evento);
      return;
    }
    this.pular.emit();
  }

  protected aumentarEscala(): void {
    const atual = this.layout();
    this.preferencias.definirLayoutElemento(ID_ELEMENTO, {
      ...atual,
      escala: Math.min(ESCALA_MAXIMA, atual.escala + 0.1),
    });
  }

  protected diminuirEscala(): void {
    const atual = this.layout();
    this.preferencias.definirLayoutElemento(ID_ELEMENTO, {
      ...atual,
      escala: Math.max(ESCALA_MINIMA, atual.escala - 0.1),
    });
  }

  private iniciarArraste(evento: PointerEvent): void {
    evento.preventDefault();

    const aoMover = (movimento: PointerEvent): void => {
      const x = (movimento.clientX / window.innerWidth) * 100;
      const y = (movimento.clientY / window.innerHeight) * 100;
      this.preferencias.definirLayoutElemento(ID_ELEMENTO, { ...this.layout(), x, y });
    };

    const aoSoltar = (): void => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
    };

    window.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);
  }
}
