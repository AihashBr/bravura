import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import type { Vetor3 } from '../../objeto-base';

/**
 * Ponto único de acesso ao controle de camera em primeira pessoa. Usa o
 * PointerLockControls do proprio three.js (nao precisou instalar lib
 * nenhuma). Nenhum outro arquivo deve importar essa lib diretamente.
 */
export class CameraPrimeiraPessoa {
  private static readonly SENSIBILIDADE_PADRAO = 0.0035;

  private readonly controles: PointerLockControls;
  private sensibilidade = CameraPrimeiraPessoa.SENSIBILIDADE_PADRAO;

  constructor(camera: THREE.PerspectiveCamera, elemento: HTMLElement) {
    camera.rotation.order = 'YXZ';
    this.controles = new PointerLockControls(camera, elemento);
  }

  /** Afeta tanto o giro por mouse (PointerLockControls) quanto por toque. */
  definirSensibilidade(valor: number): void {
    this.sensibilidade = valor;
    this.controles.pointerSpeed = valor / CameraPrimeiraPessoa.SENSIBILIDADE_PADRAO;
  }

  /**
   * Gira a camera manualmente a partir de um delta em pixels (usado
   * pelo toque, ja que o PointerLockControls so gira sozinho em
   * resposta ao mouse travado). Livre em todas as direcoes, com o
   * eixo vertical limitado pra nao virar de cabeca pra baixo.
   */
  girar(deltaX: number, deltaY: number): void {
    const camera = this.controles.object;
    camera.rotation.y -= deltaX * this.sensibilidade;
    camera.rotation.x -= deltaY * this.sensibilidade;
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
  }

  travar(): void {
    this.controles.lock();
  }

  destravar(): void {
    this.controles.unlock();
  }

  estaTravada(): boolean {
    return this.controles.isLocked;
  }

  obterAnguloHorizontal(): number {
    return this.controles.object.rotation.y;
  }

  definirPosicao(posicao: Vetor3): void {
    this.controles.object.position.set(posicao.x, posicao.y, posicao.z);
  }

  descartar(): void {
    this.controles.dispose();
  }
}
