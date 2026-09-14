import { Component, computed, inject, input, output } from '@angular/core';
import { LayoutElementoUi, Preferencias } from '../../servicos/preferencias';

const ESCALA_MINIMA = 0.5;
const ESCALA_MAXIMA = 2;

/**
 * Botao de acao generico na tela (pular, atirar, etc.). Qualquer
 * botao de HUD que precise de posicao/escala configuraveis e do modo
 * de edicao de layout usa esse componente, passando so o
 * identificador, o icone e a posicao padrao — nao escreve essa
 * logica de novo em cada botao.
 */
@Component({
  selector: 'app-botao-acao',
  imports: [],
  templateUrl: './botao-acao.html',
  styleUrl: './botao-acao.scss',
})
export class BotaoAcao {
  private readonly preferencias = inject(Preferencias);

  readonly identificador = input.required<string>();
  readonly icone = input.required<string>();
  readonly layoutPadrao = input.required<LayoutElementoUi>();

  protected readonly layout = computed(() =>
    this.preferencias.obterLayoutElemento(this.identificador(), this.layoutPadrao())(),
  );
  protected readonly modoEdicao = this.preferencias.modoEdicaoLayout;

  readonly acionar = output<void>();

  protected aoPressionar(evento: PointerEvent): void {
    if (this.modoEdicao()) {
      this.iniciarArraste(evento);
      return;
    }
    this.acionar.emit();
  }

  protected aumentarEscala(): void {
    const atual = this.layout();
    this.preferencias.definirLayoutElemento(this.identificador(), {
      ...atual,
      escala: Math.min(ESCALA_MAXIMA, atual.escala + 0.1),
    });
  }

  protected diminuirEscala(): void {
    const atual = this.layout();
    this.preferencias.definirLayoutElemento(this.identificador(), {
      ...atual,
      escala: Math.max(ESCALA_MINIMA, atual.escala - 0.1),
    });
  }

  private iniciarArraste(evento: PointerEvent): void {
    evento.preventDefault();

    const aoMover = (movimento: PointerEvent): void => {
      const x = (movimento.clientX / window.innerWidth) * 100;
      const y = (movimento.clientY / window.innerHeight) * 100;
      this.preferencias.definirLayoutElemento(this.identificador(), { ...this.layout(), x, y });
    };

    const aoSoltar = (): void => {
      window.removeEventListener('pointermove', aoMover);
      window.removeEventListener('pointerup', aoSoltar);
    };

    window.addEventListener('pointermove', aoMover);
    window.addEventListener('pointerup', aoSoltar);
  }
}
