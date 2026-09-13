import * as THREE from 'three';
import { Fisica } from '../../motor/fisica';
import type { ObjetoBase, Quaternio, Vetor3 } from '../objeto-base';

let proximoId = 0;

/**
 * Mapa de teste, o mais simples possivel: um plano estatico que serve
 * de chao.
 */
export class MapaTeste implements ObjetoBase {
  readonly id: string;

  private readonly malha: THREE.Mesh;
  private readonly corpo: Ammo.btRigidBody;

  constructor(
    private readonly fisica: Fisica,
    largura: number,
    profundidade: number,
  ) {
    this.id = `mapa-teste-${proximoId++}`;

    const geometria = new THREE.PlaneGeometry(largura, profundidade);
    const material = new THREE.MeshStandardMaterial({ color: 0x3a5f3a });
    this.malha = new THREE.Mesh(geometria, material);
    this.malha.rotation.x = -Math.PI / 2;

    const espessura = 0.2;
    const forma = fisica.criarFormaCaixa(largura / 2, espessura / 2, profundidade / 2);
    this.corpo = fisica.criarCorpoRigido(forma, 0, { x: 0, y: -espessura / 2, z: 0 });
    fisica.adicionarCorpo(this.corpo);
  }

  obterMalha(): THREE.Object3D {
    return this.malha;
  }

  obterPosicao(): Vetor3 {
    const posicao = this.malha.position;
    return { x: posicao.x, y: posicao.y, z: posicao.z };
  }

  definirPosicao(posicao: Vetor3): void {
    this.malha.position.set(posicao.x, posicao.y, posicao.z);
    this.fisica.definirTransformacaoCorpo(this.corpo, posicao);
  }

  obterEscala(): Vetor3 {
    const escala = this.malha.scale;
    return { x: escala.x, y: escala.y, z: escala.z };
  }

  definirEscala(escala: Vetor3): void {
    this.malha.scale.set(escala.x, escala.y, escala.z);
  }

  obterRotacao(): Quaternio {
    const rotacao = this.malha.quaternion;
    return { x: rotacao.x, y: rotacao.y, z: rotacao.z, w: rotacao.w };
  }

  definirRotacao(rotacao: Quaternio): void {
    this.malha.quaternion.set(rotacao.x, rotacao.y, rotacao.z, rotacao.w);
  }

  atualizar(_deltaTempo: number): void {
    // mapa e estatico, nao precisa de logica por frame
  }

  destruir(): void {
    this.fisica.removerCorpo(this.corpo);
    this.malha.geometry.dispose();
    (this.malha.material as THREE.Material).dispose();
  }
}
