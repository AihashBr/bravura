import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import type { Vetor3 } from '../objetos/objeto-base';

/**
 * Ponto único de acesso ao controle de camera em primeira pessoa. Usa o
 * PointerLockControls do proprio three.js (nao precisou instalar lib
 * nenhuma). Nenhum outro arquivo deve importar essa lib diretamente.
 */
export class CameraPrimeiraPessoa {
  private readonly controles: PointerLockControls;

  constructor(camera: THREE.PerspectiveCamera, elemento: HTMLElement) {
    camera.rotation.order = 'YXZ';
    this.controles = new PointerLockControls(camera, elemento);
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
