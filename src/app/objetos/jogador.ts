import * as THREE from 'three';
import { Fisica } from '../motor/fisica';
import { CameraPrimeiraPessoa } from '../motor/camera-primeira-pessoa';
import { Analogico } from '../entrada/analogico';
import type { ObjetoBase, Quaternio, Vetor3 } from './objeto-base';

let proximoId = 0;

/**
 * O jogador: uma capsula com fisica propria, movida pelo analogico e,
 * opcionalmente, seguida por uma camera em primeira pessoa.
 */
export class Jogador implements ObjetoBase {
  readonly id: string;

  private readonly malha: THREE.Mesh;
  private readonly corpo: Ammo.btRigidBody;
  private readonly analogico = new Analogico();
  private cameraPrimeiraPessoa: CameraPrimeiraPessoa | null = null;

  private readonly velocidadeDeslocamento = 4;

  constructor(
    private readonly fisica: Fisica,
    raio: number,
    alturaTotal: number,
    posicaoInicial: Vetor3,
  ) {
    this.id = `jogador-${proximoId++}`;

    const alturaCilindro = Math.max(alturaTotal - raio * 2, 0);

    const geometria = new THREE.CapsuleGeometry(raio, alturaCilindro, 8, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x2299ff });
    this.malha = new THREE.Mesh(geometria, material);
    this.malha.position.set(posicaoInicial.x, posicaoInicial.y, posicaoInicial.z);

    const forma = fisica.criarFormaCapsula(raio, alturaCilindro);
    this.corpo = fisica.criarCorpoRigido(forma, 70, posicaoInicial);
    fisica.adicionarCorpo(this.corpo);
  }

  anexarCamera(camera: CameraPrimeiraPessoa): void {
    this.cameraPrimeiraPessoa = camera;
  }

  obterMalha(): THREE.Object3D {
    return this.malha;
  }

  atualizar(_deltaTempo: number): void {
    const direcao = this.analogico.obterDirecao();
    const angulo = this.cameraPrimeiraPessoa?.obterAnguloHorizontal() ?? 0;
    const seno = Math.sin(angulo);
    const cosseno = Math.cos(angulo);

    const velocidadeAtual = this.fisica.obterVelocidadeLinear(this.corpo);
    this.fisica.definirVelocidadeLinear(this.corpo, {
      x: (direcao.x * cosseno - direcao.y * seno) * this.velocidadeDeslocamento,
      y: velocidadeAtual.y,
      z: (direcao.x * seno + direcao.y * cosseno) * this.velocidadeDeslocamento,
    });

    const transformacao = this.fisica.obterTransformacaoCorpo(this.corpo);
    this.malha.position.set(transformacao.posicao.x, transformacao.posicao.y, transformacao.posicao.z);
    this.malha.quaternion.set(
      transformacao.rotacao.x,
      transformacao.rotacao.y,
      transformacao.rotacao.z,
      transformacao.rotacao.w,
    );

    this.cameraPrimeiraPessoa?.definirPosicao(transformacao.posicao);
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

  destruir(): void {
    this.analogico.descartar();
    this.fisica.removerCorpo(this.corpo);
    this.malha.geometry.dispose();
    (this.malha.material as THREE.Material).dispose();
  }
}
