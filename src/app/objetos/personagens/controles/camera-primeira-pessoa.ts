import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import type { Vetor3 } from '../../objeto-base';

/**
 * Ponto único de acesso ao controle de camera em primeira pessoa. Usa o
 * PointerLockControls do proprio three.js (nao precisou instalar lib
 * nenhuma). Nenhum outro arquivo deve importar essa lib diretamente.
 */
export class CameraPrimeiraPessoa {
  /** Multiplicador de giro por toque (radianos/pixel) no topo do slider (sensibilidade = 1). */
  private static readonly SENSIBILIDADE_MAXIMA = 0.01;
  /** Sensibilidade de toque equivalente ao pointerSpeed=1 (padrao) do PointerLockControls. */
  private static readonly SENSIBILIDADE_MOUSE_NORMAL = 0.0035;

  private readonly controles: PointerLockControls;
  private sensibilidade = CameraPrimeiraPessoa.SENSIBILIDADE_MOUSE_NORMAL;

  constructor(camera: THREE.PerspectiveCamera, elemento: HTMLElement) {
    camera.rotation.order = 'YXZ';
    this.controles = new PointerLockControls(camera, elemento);
  }

  /**
   * Afeta tanto o giro por mouse (PointerLockControls) quanto por
   * toque. `normalizada` vai de 0 a 1 — e a mesma escala usada pelo
   * slider de configuracoes.
   */
  definirSensibilidade(normalizada: number): void {
    this.sensibilidade = normalizada * CameraPrimeiraPessoa.SENSIBILIDADE_MAXIMA;
    this.controles.pointerSpeed = this.sensibilidade / CameraPrimeiraPessoa.SENSIBILIDADE_MOUSE_NORMAL;
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

  obterPosicao(): Vetor3 {
    const posicao = this.controles.object.position;
    return { x: posicao.x, y: posicao.y, z: posicao.z };
  }

  /** Vetor unitario pra onde a camera esta olhando, em 3D (inclui o eixo vertical). */
  obterDirecaoOlhar(): Vetor3 {
    const direcao = new THREE.Vector3();
    this.controles.object.getWorldDirection(direcao);
    return { x: direcao.x, y: direcao.y, z: direcao.z };
  }

  descartar(): void {
    this.controles.dispose();
  }
}
