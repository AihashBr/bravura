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

  posicao: Vetor3;
  escala: Vetor3;
  rotacao: Quaternio;

  atualizar(deltaTempo: number): void;

  destruir(): void;
}
