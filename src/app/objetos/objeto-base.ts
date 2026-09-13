export interface Vetor3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternio {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 * Contrato que todo objeto do jogo deve seguir.
 */
export interface ObjetoBase {
  readonly id: string;

  obterPosicao(): Vetor3;
  definirPosicao(posicao: Vetor3): void;

  obterEscala(): Vetor3;
  definirEscala(escala: Vetor3): void;

  obterRotacao(): Quaternio;
  definirRotacao(rotacao: Quaternio): void;

  atualizar(deltaTempo: number): void;

  destruir(): void;
}
