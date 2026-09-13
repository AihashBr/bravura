/**
 * Contrato que todo objeto do jogo deve seguir.
 */
export interface ObjetoBase {
  readonly id: string;

  atualizar(deltaTempo: number): void;

  destruir(): void;
}
