import type { DirecaoAnalogica } from './analogico';

/**
 * Controle por toque: a metade esquerda da tela move o personagem
 * (como um analogico virtual, com a intensidade proporcional a
 * distancia arrastada), a metade direita gira a camera livremente em
 * qualquer direcao. Cada lado aceita um dedo por vez, entao dá pra
 * usar os dois ao mesmo tempo.
 */
export class Toque {
  private idToqueMovimento: number | null = null;
  private origemMovimento = { x: 0, y: 0 };
  private direcaoMovimento: DirecaoAnalogica = { x: 0, y: 0 };

  private idToqueOlhar: number | null = null;
  private ultimaPosicaoOlhar = { x: 0, y: 0 };
  private deltaOlharAcumulado = { x: 0, y: 0 };

  private readonly raioMaximo = 60;

  private readonly aoIniciar = (evento: TouchEvent): void => {
    evento.preventDefault();
    for (const toque of Array.from(evento.changedTouches)) {
      const metadeEsquerda = toque.clientX < window.innerWidth / 2;
      if (metadeEsquerda && this.idToqueMovimento === null) {
        this.idToqueMovimento = toque.identifier;
        this.origemMovimento = { x: toque.clientX, y: toque.clientY };
      } else if (!metadeEsquerda && this.idToqueOlhar === null) {
        this.idToqueOlhar = toque.identifier;
        this.ultimaPosicaoOlhar = { x: toque.clientX, y: toque.clientY };
      }
    }
  };

  private readonly aoMover = (evento: TouchEvent): void => {
    evento.preventDefault();
    for (const toque of Array.from(evento.changedTouches)) {
      if (toque.identifier === this.idToqueMovimento) {
        const dx = toque.clientX - this.origemMovimento.x;
        const dy = toque.clientY - this.origemMovimento.y;
        const distancia = Math.hypot(dx, dy);
        if (distancia === 0) {
          this.direcaoMovimento = { x: 0, y: 0 };
        } else {
          const fator = Math.min(distancia, this.raioMaximo) / this.raioMaximo;
          this.direcaoMovimento = { x: (dx / distancia) * fator, y: (-dy / distancia) * fator };
        }
      } else if (toque.identifier === this.idToqueOlhar) {
        this.deltaOlharAcumulado.x += toque.clientX - this.ultimaPosicaoOlhar.x;
        this.deltaOlharAcumulado.y += toque.clientY - this.ultimaPosicaoOlhar.y;
        this.ultimaPosicaoOlhar = { x: toque.clientX, y: toque.clientY };
      }
    }
  };

  private readonly aoFinalizar = (evento: TouchEvent): void => {
    for (const toque of Array.from(evento.changedTouches)) {
      if (toque.identifier === this.idToqueMovimento) {
        this.idToqueMovimento = null;
        this.direcaoMovimento = { x: 0, y: 0 };
      } else if (toque.identifier === this.idToqueOlhar) {
        this.idToqueOlhar = null;
      }
    }
  };

  constructor(private readonly elemento: HTMLElement) {
    elemento.addEventListener('touchstart', this.aoIniciar, { passive: false });
    elemento.addEventListener('touchmove', this.aoMover, { passive: false });
    elemento.addEventListener('touchend', this.aoFinalizar);
    elemento.addEventListener('touchcancel', this.aoFinalizar);
  }

  obterDirecaoMovimento(): DirecaoAnalogica {
    return this.direcaoMovimento;
  }

  /** Devolve o quanto a camera deve girar desde a ultima chamada e zera o acumulado. */
  consumirDeltaOlhar(): DirecaoAnalogica {
    const delta = this.deltaOlharAcumulado;
    this.deltaOlharAcumulado = { x: 0, y: 0 };
    return delta;
  }

  descartar(): void {
    this.elemento.removeEventListener('touchstart', this.aoIniciar);
    this.elemento.removeEventListener('touchmove', this.aoMover);
    this.elemento.removeEventListener('touchend', this.aoFinalizar);
    this.elemento.removeEventListener('touchcancel', this.aoFinalizar);
  }
}
