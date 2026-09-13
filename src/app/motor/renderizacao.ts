import * as THREE from 'three';

/**
 * Ponto único de acesso ao three.js no jogo. Nenhum outro arquivo deve
 * importar `three` diretamente — tudo passa por aqui.
 */
export class Renderizacao {
  private readonly cena: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderizador: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, largura: number, altura: number) {
    this.cena = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, largura / altura, 0.1, 1000);
    this.renderizador = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderizador.setSize(largura, altura);
  }

  adicionarObjeto(objeto: THREE.Object3D): void {
    this.cena.add(objeto);
  }

  removerObjeto(objeto: THREE.Object3D): void {
    this.cena.remove(objeto);
  }

  redimensionar(largura: number, altura: number): void {
    this.camera.aspect = largura / altura;
    this.camera.updateProjectionMatrix();
    this.renderizador.setSize(largura, altura);
  }

  renderizar(): void {
    this.renderizador.render(this.cena, this.camera);
  }

  obterCena(): THREE.Scene {
    return this.cena;
  }

  obterCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  descartar(): void {
    this.renderizador.dispose();
  }
}
