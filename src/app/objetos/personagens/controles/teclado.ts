export interface DirecaoAnalogica {
  x: number;
  y: number;
}

/**
 * Le as teclas de movimento (WASD/setas) e expoe uma direcao
 * normalizada, como um analogico de controle. Unico ponto de acesso a
 * eventos de teclado de movimento no jogo.
 */
export class Teclado {
  private paraFrente = false;
  private paraTras = false;
  private paraEsquerda = false;
  private paraDireita = false;

  private readonly aoPressionar = (evento: KeyboardEvent): void => this.definirTecla(evento.code, true);
  private readonly aoSoltar = (evento: KeyboardEvent): void => this.definirTecla(evento.code, false);

  constructor() {
    window.addEventListener('keydown', this.aoPressionar);
    window.addEventListener('keyup', this.aoSoltar);
  }

  private definirTecla(codigo: string, pressionada: boolean): void {
    switch (codigo) {
      case 'KeyW':
      case 'ArrowUp':
        this.paraFrente = pressionada;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.paraTras = pressionada;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.paraEsquerda = pressionada;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.paraDireita = pressionada;
        break;
    }
  }

  obterDirecao(): DirecaoAnalogica {
    const x = Number(this.paraDireita) - Number(this.paraEsquerda);
    const y = Number(this.paraFrente) - Number(this.paraTras);
    const magnitude = Math.hypot(x, y);

    if (magnitude === 0) {
      return { x: 0, y: 0 };
    }
    return { x: x / magnitude, y: y / magnitude };
  }

  descartar(): void {
    window.removeEventListener('keydown', this.aoPressionar);
    window.removeEventListener('keyup', this.aoSoltar);
  }
}
